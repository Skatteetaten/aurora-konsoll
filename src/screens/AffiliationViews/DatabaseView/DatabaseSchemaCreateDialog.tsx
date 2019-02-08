import * as React from 'react';
import styled from 'styled-components';

import Button from 'aurora-frontend-react-komponenter/Button';
import Dialog from 'aurora-frontend-react-komponenter/Dialog';
import LoadingButton from 'components/LoadingButton';
import { ICreateDatabaseSchemaInput } from 'models/schemas';
import DatabaseSchemaService from 'services/DatabaseSchemaService';
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
  createResponse: boolean;
}

interface IDatabaseSchemaCreateDialogState {
  isOpen: boolean;
  isLoading: boolean;
  step: Step;
  labels: ICreateDatabaseSchemaInput;
}

class DatabaseSchemaCreateDialog extends React.Component<
  IDatabaseSchemaCreateDialogProps,
  IDatabaseSchemaCreateDialogState
> {
  public state = {
    isOpen: false,
    isLoading: false,
    step: Step.TYPE,
    labels: {
      discriminator: '',
      createdBy: '',
      description: '',
      environment: '',
      application: '',
      affiliation: this.props.affiliation
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

  public setLabels = (labels: ICreateDatabaseSchemaInput) => {
    this.setState({
      labels
    });
  };

  public createDatabaseSchema = async () => {
    const { onCreate } = this.props;
    const { labels } = this.state;
    this.setState({
      isLoading: true
    });
    await onCreate(labels);
  };

  public componentWillUnmount() {
    this.setState({
      isLoading: false
    });
  }

  public render() {
    const { className } = this.props;
    const { isOpen, isLoading, step, labels } = this.state;

    const close = this.toggleDialog(false);
    const open = this.toggleDialog(true);

    const isNew = step === Step.NEW;
    const isType = step === Step.TYPE;

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
              {isNew && <New setLabels={this.setLabels} labels={labels} />}
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
                  this.databaseSchemaService.hasEmptyValues(labels) || isLoading
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
