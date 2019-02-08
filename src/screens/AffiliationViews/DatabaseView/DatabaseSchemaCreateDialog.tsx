import * as React from 'react';
import styled from 'styled-components';

import Button from 'aurora-frontend-react-komponenter/Button';
import Dialog from 'aurora-frontend-react-komponenter/Dialog';
import LoadingButton from 'components/LoadingButton';
import { ICreateDatabaseSchemaInput, IJdbcUser } from 'models/schemas';
import DatabaseSchemaService from 'services/DatabaseSchemaService';
import External from './createDialogSteps/External';
import New from './createDialogSteps/New';
import Type from './createDialogSteps/Type';

export enum Step {
  TYPE,
  NEW,
  EXTERNAL
}

interface IDatabaseSchemaCreateDialogProps {
  className?: string;
  affiliation: string;
  onCreate: (databaseSchema: ICreateDatabaseSchemaInput) => void;
  onTestJdbcConnectionForUser: (jdbcUser: IJdbcUser) => void;
  createResponse: boolean;
  testJdbcConnectionResponse: boolean;
}

interface IDatabaseSchemaCreateDialogState {
  isOpen: boolean;
  isLoading: boolean;
  step: Step;
  databaseSchemaInput: ICreateDatabaseSchemaInput;
}

class DatabaseSchemaCreateDialog extends React.Component<
  IDatabaseSchemaCreateDialogProps,
  IDatabaseSchemaCreateDialogState
> {
  public state = {
    isOpen: false,
    isLoading: false,
    step: Step.TYPE,
    databaseSchemaInput: {
      discriminator: '',
      createdBy: '',
      description: '',
      environment: '',
      application: '',
      affiliation: this.props.affiliation,
      jdbcUser: {
        username: '',
        password: '',
        jdbcUrl: ''
      }
    }
  };

  private databaseSchemaService = new DatabaseSchemaService();

  public toggleDialog = (isOpen: boolean) => () => {
    this.setState({
      isOpen
    });
    if (isOpen) {
      this.setState({
        step: Step.TYPE
      });
    }
  };

  public handleLabelChange = (field: string) => (value: string) => {
    return;
  };

  public setStep = (newStep: string) => {
    this.setState({
      step: Number(newStep)
    });
  };

  public setDatabaseSchemaInput = (
    databaseSchemaInput: ICreateDatabaseSchemaInput
  ) => {
    this.setState({
      databaseSchemaInput
    });
  };

  public createDatabaseSchema = async () => {
    const { onCreate } = this.props;
    const { databaseSchemaInput } = this.state;
    this.setState({
      isLoading: true
    });
    await onCreate(databaseSchemaInput);
  };

  public componentWillUnmount() {
    this.setState({
      isLoading: false
    });
  }

  public render() {
    const {
      className,
      onTestJdbcConnectionForUser,
      testJdbcConnectionResponse
    } = this.props;
    const { isOpen, isLoading, step, databaseSchemaInput } = this.state;

    const close = this.toggleDialog(false);
    const open = this.toggleDialog(true);

    const isNew = step === Step.NEW;
    const isType = step === Step.TYPE;
    const isExternal = step === Step.EXTERNAL;

    return (
      <>
        <Button buttonType="primary" icon="AddOutline" onClick={open}>
          Nytt skjema
        </Button>
        <Dialog
          title={
            isType
              ? 'Velg skjematype'
              : isNew
              ? 'Nytt skjema'
              : 'Eksternt skjema'
          }
          hidden={!isOpen}
          dialogMinWidth="1000px"
          dialogMaxWidth="90%"
          dialogMinHeight="1000px"
          onDismiss={close}
        >
          <div className={className}>
            <div className="styled-dialog">
              {isType && <Type setStep={this.setStep} />}
              {isNew && (
                <New
                  setDatabaseSchemaInput={this.setDatabaseSchemaInput}
                  databaseSchemaInput={databaseSchemaInput}
                />
              )}
              {isExternal && (
                <External
                  setDatabaseSchemaInput={this.setDatabaseSchemaInput}
                  databaseSchemaInput={databaseSchemaInput}
                  onTestJdbcConnectionForUser={onTestJdbcConnectionForUser}
                  testJdbcConnectionResponse={testJdbcConnectionResponse}
                />
              )}
            </div>
          </div>
          <Dialog.Footer>
            {isType && <div style={{ height: '5px' }} />}
            {isNew && (
              <LoadingButton
                onClick={this.createDatabaseSchema}
                buttonType="primaryRoundedFilled"
                style={{ width: '150px' }}
                loading={isLoading}
                disabled={
                  this.databaseSchemaService.hasEmptyValues(
                    databaseSchemaInput
                  ) || isLoading
                }
              >
                Opprett
              </LoadingButton>
            )}
          </Dialog.Footer>
        </Dialog>
      </>
    );
  }
}

export default styled(DatabaseSchemaCreateDialog)`
  .styled-dialog {
    height: 400px;
  }
`;