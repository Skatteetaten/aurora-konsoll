import * as React from 'react';
import styled from 'styled-components';

import ActionButton from 'aurora-frontend-react-komponenter/ActionButton';
import Dialog from 'aurora-frontend-react-komponenter/Dialog';
import Grid from 'aurora-frontend-react-komponenter/Grid';
import Icon from 'aurora-frontend-react-komponenter/Icon';
import TextField from 'aurora-frontend-react-komponenter/TextField';
import palette from 'aurora-frontend-react-komponenter/utils/palette';

import ConfirmationDialog from 'components/ConfirmationDialog';
import LoadingButton from 'components/LoadingButton';
import {
  IDatabaseSchema,
  IDatabaseSchemaInputWithUserId
} from 'models/schemas';
import DatabaseSchemaService from 'services/DatabaseSchemaService';
import { getLocalDatetime } from 'utils/date';

const { skeColor } = palette;

enum JdcbTestState {
  NOT_STARTED,
  LOADING,
  RESPONSE
}

export interface IDatabaseSchemaDialogProps {
  schema?: IDatabaseSchema;
  className?: string;
  clearSelectedSchema: () => void;
  onUpdate: (databaseSchema: IDatabaseSchemaInputWithUserId) => void;
  onDelete: (databaseSchema: IDatabaseSchema) => void;
  onTestJdbcConnectionForId: (id: string) => void;
  databaseSchemaService: DatabaseSchemaService;
  testJdbcConnectionResponse: boolean;
}

export interface IDatabaseSchemaDialogState {
  updatedSchemaValues: {
    id: string;
    discriminator: string;
    createdBy: string;
    description?: string | null;
    environment: string;
    application: string;
    affiliation: string;
  };
  jdcbTestState: JdcbTestState;
}

class DatabaseSchemaDialog extends React.Component<
  IDatabaseSchemaDialogProps,
  IDatabaseSchemaDialogState
> {
  public state = {
    updatedSchemaValues: {
      id: '',
      discriminator: '',
      createdBy: '',
      description: '',
      environment: '',
      application: '',
      affiliation: ''
    },
    jdcbTestState: JdcbTestState.NOT_STARTED
  };

  public componentDidUpdate(prevProps: IDatabaseSchemaDialogProps) {
    const { schema } = this.props;
    if (schema) {
      if (typeof prevProps.schema === 'undefined') {
        this.setState({
          updatedSchemaValues: {
            id: schema.id,
            discriminator: schema.discriminator,
            createdBy: schema.createdBy,
            description: schema.description ? schema.description : '',
            environment: schema.environment,
            application: schema.application,
            affiliation: schema.affiliation.name
          },
          jdcbTestState: JdcbTestState.NOT_STARTED
        });
      }
    }
  }

  public hideDialog = () => {
    const { clearSelectedSchema } = this.props;
    clearSelectedSchema();
  };

  public handleLabelChange = (field: string) => (value: string) => {
    this.setState(state => ({
      updatedSchemaValues: {
        ...state.updatedSchemaValues,
        [field]: value
      }
    }));
  };

  public updateLabels = () => {
    const { schema, onUpdate } = this.props;
    const { updatedSchemaValues } = this.state;
    if (schema) {
      const newValues: IDatabaseSchemaInputWithUserId = {
        affiliation: schema.affiliation.name,
        application: updatedSchemaValues.application,
        description: updatedSchemaValues.description,
        environment: updatedSchemaValues.environment,
        discriminator: updatedSchemaValues.discriminator,
        id: schema.id,
        userId: updatedSchemaValues.createdBy
      };
      onUpdate(newValues);
      this.hideDialog();
    }
  };

  public renderConfirmationOpenButton = (open: () => void) => (
    <ActionButton
      onClick={open}
      iconSize={ActionButton.LARGE}
      icon="Delete"
      color="black"
      style={{ float: 'left' }}
    >
      Slett
    </ActionButton>
  );

  public renderConfirmationFooterButtons = (close: () => void) => {
    const { schema, onDelete } = this.props;
    const deleteSchema = () => {
      if (schema) {
        onDelete(schema);
        close();
        this.hideDialog();
      }
    };

    return (
      <>
        <ActionButton
          onClick={close}
          iconSize={ActionButton.LARGE}
          icon="Cancel"
          color="black"
        >
          Nei
        </ActionButton>
        <ActionButton
          onClick={deleteSchema}
          iconSize={ActionButton.LARGE}
          icon="Check"
          color="black"
        >
          Ja
        </ActionButton>
      </>
    );
  };

  public handleTestJdbcConnection = async () => {
    const { onTestJdbcConnectionForId, schema } = this.props;
    const handleJdbcLoading = () => {
      this.setState({
        jdcbTestState: JdcbTestState.RESPONSE
      });
    };
    if (schema) {
      this.setState({
        jdcbTestState: JdcbTestState.LOADING
      });
      await onTestJdbcConnectionForId(schema.id);
      handleJdbcLoading();
    }
  };

  public render() {
    const {
      schema,
      className,
      databaseSchemaService,
      testJdbcConnectionResponse
    } = this.props;
    const { updatedSchemaValues, jdcbTestState } = this.state;
    if (!schema) {
      return <div />;
    }

    const dateTimeFormat = (date?: Date | null) =>
      date ? getLocalDatetime(date) : '';

    const displayLoadingOrNotStarted =
      jdcbTestState === JdcbTestState.LOADING ||
      jdcbTestState === JdcbTestState.NOT_STARTED;

    const displaySuccess =
      !displayLoadingOrNotStarted && testJdbcConnectionResponse;

    const displayFailure =
      !displayLoadingOrNotStarted && !testJdbcConnectionResponse;

    const user = schema.users[0];
    return (
      <Dialog
        hidden={!!!schema}
        onDismiss={this.hideDialog}
        dialogMinWidth="1000px"
        dialogMaxWidth="90%"
      >
        <div className={className}>
          <Grid>
            <Grid.Row>
              <Grid.Col lg={2} className="bold">
                <p>Id: </p>
                <p>Type: </p>
                <p>Sist brukt: </p>
                <p>Opprettet: </p>
              </Grid.Col>
              <Grid.Col lg={10}>
                <p>{schema.id}</p>
                <p>{schema.type}</p>
                <p>{dateTimeFormat(schema.lastUsedDate)}</p>
                <p>{dateTimeFormat(schema.createdDate)}</p>
              </Grid.Col>
            </Grid.Row>
            <hr />
            <Grid.Row>
              <Grid.Col lg={6}>
                <h3>Tilkoblingsinformasjon</h3>
                <TextField
                  id={'username'}
                  label={'Brukernavn'}
                  value={user.username}
                  disabled={true}
                />
                <TextField
                  id={'jdbcUrl'}
                  label={'JDBC url'}
                  value={schema.jdbcUrl}
                  disabled={true}
                />
                <div className="styled-jdbc">
                  <LoadingButton
                    onClick={this.handleTestJdbcConnection}
                    buttonType="primary"
                    style={{ width: '100%' }}
                    loading={jdcbTestState === JdcbTestState.LOADING}
                  >
                    TEST JDBC TILKOBLING
                  </LoadingButton>
                </div>
                <p className="styled-jdbc-wrapper">
                  Gyldig JDBC tilkobling:
                  {displayLoadingOrNotStarted && (
                    <span className="bold styled-jdbc-status">ikke testet</span>
                  )}
                  {displaySuccess && (
                    <Icon
                      className="styled-jdbc-status"
                      iconName="Check"
                      style={{ color: skeColor.green, fontSize: '30px' }}
                    />
                  )}
                  {displayFailure && (
                    <Icon
                      className="styled-jdbc-status"
                      iconName="Clear"
                      style={{
                        color: skeColor.pink,
                        fontSize: '30px'
                      }}
                    />
                  )}
                </p>
              </Grid.Col>
              <Grid.Col lg={1} />
              <Grid.Col lg={5}>
                <h3>Labels</h3>
                <TextField
                  id={'environment'}
                  label={'Miljø'}
                  value={updatedSchemaValues.environment}
                  onChanged={this.handleLabelChange('environment')}
                />
                <TextField
                  id={'application'}
                  label={'Applikasjon'}
                  value={updatedSchemaValues.application}
                  onChanged={this.handleLabelChange('application')}
                />
                <TextField
                  id={'discriminator'}
                  label={'Diskriminator'}
                  value={updatedSchemaValues.discriminator}
                  onChanged={this.handleLabelChange('discriminator')}
                />
                <TextField
                  id={'createdBy'}
                  label={'Bruker'}
                  value={updatedSchemaValues.createdBy}
                  onChanged={this.handleLabelChange('createdBy')}
                />
                <TextField
                  id={'description'}
                  label={'Beskrivelse'}
                  value={updatedSchemaValues.description}
                  onChanged={this.handleLabelChange('description')}
                  multiline={true}
                />
              </Grid.Col>
            </Grid.Row>
          </Grid>
        </div>
        <div className={className}>
          <Dialog.Footer>
            <ConfirmationDialog
              title="Slett databaseskjema"
              text={`Ønsker du å slette databaseskjemaet til ${
                updatedSchemaValues.application
              }?`}
              renderOpenDialogButton={this.renderConfirmationOpenButton}
              renderFooterButtons={this.renderConfirmationFooterButtons}
            />
            <ActionButton onClick={this.hideDialog}>Avbryt</ActionButton>
            <ActionButton
              onClick={this.updateLabels}
              disabled={databaseSchemaService.isUpdateButtonDisabled(
                updatedSchemaValues,
                schema
              )}
            >
              Oppdater
            </ActionButton>
          </Dialog.Footer>
        </div>
      </Dialog>
    );
  }
}

export default styled(DatabaseSchemaDialog)`
  .bold {
    font-weight: bold;
  }

  .styled-jdbc-status {
    margin-left: 7px;
  }

  .styled-jdbc {
    padding-top: 10px;
  }

  .styled-jdbc-wrapper {
    display: flex;
    align-items: center;
    height: 30px;
  }

  .ms-TextField-wrapper {
    padding-bottom: 10px;
  }

  .ms-Button.is-disabled {
    color: ${skeColor.grey};
  }
`;
