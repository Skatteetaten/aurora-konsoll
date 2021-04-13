import * as React from 'react';
import styled from 'styled-components';

import {
  Button,
  ActionButton,
  Dialog,
} from '@skatteetaten/frontend-components';
import LoadingButton from 'components/LoadingButton';
import { IUserAndAffiliations } from 'models/ApplicationDeployment';
import {
  ICreateDatabaseSchemaInput,
  ICreateDatabaseSchemaResponse,
  IDatabaseSchema,
  IJdbcUser,
  Step,
  IDatabaseInstances,
  ITestJDBCResponse,
} from 'models/schemas';
import DatabaseSchemaService from 'services/DatabaseSchemaService';
import External from './createDialogSteps/External';
import New from './createDialogSteps/New';
import Summary from './createDialogSteps/Summary';
import Type from './createDialogSteps/Type';

interface IDatabaseSchemaCreateDialogProps {
  className?: string;
  affiliation: string;
  onFetch: (affiliations: string[]) => void;
  onCreate: (databaseSchema: ICreateDatabaseSchemaInput) => void;
  onTestJdbcConnectionForUser: (jdbcUser: IJdbcUser) => void;
  createResponse: ICreateDatabaseSchemaResponse;
  testJdbcConnectionResponse: ITestJDBCResponse;
  currentUser: IUserAndAffiliations;
  isFetching: boolean;
  initialDatabaseSchemaInput?: IDatabaseSchema;
  instances: IDatabaseInstances;
}

interface IDatabaseSchemaCreateDialogState {
  isOpen: boolean;
  isLoading: boolean;
  step: Step;
  previousStep: Step;
  databaseSchemaInput: ICreateDatabaseSchemaInput;
}

class DatabaseSchemaCreateDialog extends React.Component<
  IDatabaseSchemaCreateDialogProps,
  IDatabaseSchemaCreateDialogState
> {
  public resetInput: ICreateDatabaseSchemaInput = {
    discriminator: '',
    createdBy: this.props.currentUser.id,
    description: '',
    environment: '',
    application: '',
    affiliation: this.props.affiliation,
    jdbcUser: null,
    engine: 'ORACLE',
    instanceName: null,
  };

  public state = {
    isOpen: false,
    isLoading: false,
    step: Step.TYPE,
    previousStep: Step.TYPE,
    databaseSchemaInput: this.resetInput,
  };

  private databaseSchemaService = new DatabaseSchemaService();

  public componentDidUpdate(prevProps: IDatabaseSchemaCreateDialogProps) {
    const { initialDatabaseSchemaInput } = this.props;
    if (
      prevProps.initialDatabaseSchemaInput !== initialDatabaseSchemaInput &&
      initialDatabaseSchemaInput
    ) {
      const schema: ICreateDatabaseSchemaInput = {
        discriminator: initialDatabaseSchemaInput.discriminator,
        createdBy: this.props.currentUser.id,
        description: initialDatabaseSchemaInput.description
          ? initialDatabaseSchemaInput.description
          : '',
        environment: initialDatabaseSchemaInput.environment,
        application: initialDatabaseSchemaInput.application,
        affiliation: this.props.affiliation,
        engine: initialDatabaseSchemaInput.engine,
        jdbcUser: {
          jdbcUrl: initialDatabaseSchemaInput.jdbcUrl,
          username: initialDatabaseSchemaInput.users[0].username,
          password: initialDatabaseSchemaInput.users[0].password
            ? initialDatabaseSchemaInput.users[0].password
            : '',
        },
      };

      this.setState({
        isOpen: true,
        isLoading: false,
        step: Step.EXTERNAL,
        previousStep: Step.TYPE,
        databaseSchemaInput: schema,
      });
    }

    if (this.props.affiliation !== prevProps.affiliation) {
      this.setState((state) => ({
        databaseSchemaInput: {
          ...state.databaseSchemaInput,
          affiliation: this.props.affiliation,
        },
      }));
    }
  }

  public toggleDialog = (isOpen: boolean) => () => {
    this.setState({
      isOpen,
    });
    if (isOpen) {
      this.setState({
        step: Step.TYPE,
      });
    } else {
      this.setState({
        databaseSchemaInput: this.resetInput,
      });
    }
  };

  public handleLabelChange = (field: string) => (value: string) => {
    return;
  };

  public setStep = (newStep: Step) => {
    const { step } = this.state;
    this.setState({
      previousStep: step,
      step: newStep,
    });
  };

  public setDatabaseSchemaInput = (
    databaseSchemaInput: ICreateDatabaseSchemaInput
  ) => {
    this.setState({
      databaseSchemaInput,
    });
  };

  public setJdbcUserInput = (jdbcUser: IJdbcUser) => {
    this.setState((state) => ({
      databaseSchemaInput: {
        ...state.databaseSchemaInput,
        jdbcUser,
      },
    }));
  };

  public createDatabaseSchema = async () => {
    const { onCreate } = this.props;
    const { databaseSchemaInput, step } = this.state;
    this.setState({
      isLoading: true,
      previousStep: step,
    });

    onCreate(
      this.databaseSchemaService.trimLabelsAndJdbcUser(databaseSchemaInput)
    );
    this.setState({
      step: Step.SUMMARY,
    });
  };

  public render() {
    const {
      className,
      onTestJdbcConnectionForUser,
      testJdbcConnectionResponse,
      onFetch,
      affiliation,
      createResponse,
      isFetching,
      instances,
    } = this.props;
    const { isOpen, isLoading, step, databaseSchemaInput } = this.state;

    const back = () => {
      const { previousStep } = this.state;
      if (isNew || isExternal) {
        this.setState({
          step: Step.TYPE,
          databaseSchemaInput: this.resetInput,
        });
      } else {
        this.setState({
          isLoading: false,
          step: previousStep,
        });
      }
    };

    const closeAndFetch = () => {
      onFetch([affiliation]);
      this.setState({
        isOpen: false,
        isLoading: false,
        databaseSchemaInput: this.resetInput,
      });
    };

    const close = this.toggleDialog(false);
    const open = this.toggleDialog(true);

    const isNew = step === Step.NEW;
    const isType = step === Step.TYPE;
    const isExternal = step === Step.EXTERNAL;
    const isSummary = step === Step.SUMMARY;

    const getTitle = () => {
      switch (step) {
        case Step.TYPE:
          return 'Velg skjematype';
        case Step.NEW:
          return 'Nytt skjema';
        case Step.EXTERNAL:
          return 'Eksternt skjema';
        case Step.SUMMARY:
          return 'Oppsummering';
        default:
          return '';
      }
    };

    return (
      <>
        <Button
          buttonStyle="primaryRoundedFilled"
          icon="AddOutline"
          onClick={open}
        >
          Nytt skjema
        </Button>
        <LoadingButton
          icon="Update"
          style={{
            minWidth: '141px',
            marginLeft: '15px',
          }}
          loading={isFetching}
          onClick={closeAndFetch}
        >
          Oppdater
        </LoadingButton>
        <Dialog
          title={getTitle()}
          hidden={!isOpen}
          minWidth="1000px"
          maxWidth="90%"
          onDismiss={close}
          isBlocking={!isType}
        >
          <div className={className}>
            <div className="styled-dialog">
              {isType && <Type setStep={this.setStep} />}
              {isNew && (
                <New
                  setDatabaseSchemaInput={this.setDatabaseSchemaInput}
                  databaseSchemaInput={databaseSchemaInput}
                  instances={instances}
                />
              )}
              {isExternal && (
                <External
                  setDatabaseSchemaInput={this.setDatabaseSchemaInput}
                  setJdbcUserInput={this.setJdbcUserInput}
                  databaseSchemaInput={databaseSchemaInput}
                  onTestJdbcConnectionForUser={onTestJdbcConnectionForUser}
                  testJdbcConnectionResponse={testJdbcConnectionResponse}
                  databaseSchemaService={this.databaseSchemaService}
                />
              )}
              {isSummary && <Summary createResponse={createResponse} />}
            </div>
          </div>
          <Dialog.Footer>
            {isType && <div style={{ height: '5px' }} />}
            {(isNew || isExternal) && (
              <>
                <ActionButton
                  onClick={close}
                  style={{ float: 'left' }}
                  icon="Cancel"
                >
                  Lukk
                </ActionButton>
                <Button
                  onClick={back}
                  buttonStyle="primaryRoundedFilled"
                  style={{ width: '120px', marginRight: '10px' }}
                  icon="ArrowBack"
                >
                  Tilbake
                </Button>
              </>
            )}
            {isSummary && (
              <>
                <Button
                  onClick={back}
                  buttonStyle="primaryRoundedFilled"
                  style={{ width: '162px', marginRight: '10px' }}
                  icon="Copy"
                  title="Lag nytt databaseskjema med eksisterende verdier"
                >
                  Lag ny kopi
                </Button>
                <Button
                  onClick={closeAndFetch}
                  buttonStyle="primaryRoundedFilled"
                  style={{ width: '120px' }}
                  icon="Completed"
                >
                  Fullfør
                </Button>
              </>
            )}
            {isNew && (
              <LoadingButton
                onClick={this.createDatabaseSchema}
                buttonStyle="primaryRoundedFilled"
                style={{ width: '120px' }}
                icon="Check"
                loading={isLoading}
                disabled={
                  this.databaseSchemaService.hasEmptyLabelValues(
                    databaseSchemaInput
                  ) || isLoading
                }
              >
                Opprett
              </LoadingButton>
            )}
            {isExternal && (
              <LoadingButton
                onClick={this.createDatabaseSchema}
                buttonStyle="primaryRoundedFilled"
                style={{ width: '120px' }}
                icon="Check"
                loading={isLoading}
                disabled={
                  this.databaseSchemaService.hasEmptyLabelValues(
                    databaseSchemaInput
                  ) ||
                  this.databaseSchemaService.hasEmptyJdbcValues(
                    databaseSchemaInput.jdbcUser
                  ) ||
                  isLoading
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
    height: 380px;
    width: 1000px;
  }
`;
