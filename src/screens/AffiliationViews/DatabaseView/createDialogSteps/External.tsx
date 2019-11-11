import * as React from 'react';

import Grid from '@skatteetaten/frontend-components/Grid';
import { ICreateDatabaseSchemaInput, IJdbcUser } from 'models/schemas';
import DatabaseSchemaService from 'services/DatabaseSchemaService';
import JdbcConnection from '../JdbcConnection';
import Labels from '../Labels';

interface IExternalProps {
  setDatabaseSchemaInput: (
    databaseSchemaInput: ICreateDatabaseSchemaInput
  ) => void;
  setJdbcUserInput: (jdbcUser: IJdbcUser) => void;
  databaseSchemaInput: ICreateDatabaseSchemaInput;
  onTestJdbcConnectionForUser: (jdbcUser: IJdbcUser) => void;
  testJdbcConnectionResponse: boolean;
  databaseSchemaService: DatabaseSchemaService;
}

const External = ({
  setDatabaseSchemaInput,
  databaseSchemaInput,
  onTestJdbcConnectionForUser,
  testJdbcConnectionResponse,
  databaseSchemaService,
  setJdbcUserInput
}: IExternalProps) => {
  const handleLabelChange = (field: string) => (value: string) => {
    setDatabaseSchemaInput({
      ...databaseSchemaInput,
      [field]: value
    });
  };

  const handleJdbcChange = (field: string) => (value: string) => {
    setJdbcUserInput({
      ...databaseSchemaInput.jdbcUser,
      [field]: value
    } as IJdbcUser);
  };

  let jdbcUser: IJdbcUser;
  if (databaseSchemaInput.jdbcUser) {
    jdbcUser = databaseSchemaInput.jdbcUser;
  } else {
    jdbcUser = {
      username: '',
      password: '',
      jdbcUrl: ''
    };
  }

  const {
    environment,
    application,
    discriminator,
    description
  } = databaseSchemaInput;

  return (
    <Grid>
      <Grid.Row>
        <Grid.Col lg={6}>
          <JdbcConnection
            username={jdbcUser.username}
            password={jdbcUser.password}
            jdbcUrl={jdbcUser.jdbcUrl}
            onTestJdbcConnectionForUser={onTestJdbcConnectionForUser}
            testJdbcConnectionResponse={testJdbcConnectionResponse}
            isDisabledFields={false}
            hasPasswordField={true}
            canNotTest={databaseSchemaService.hasEmptyJdbcValues(
              databaseSchemaInput.jdbcUser
            )}
            handleJdbcChange={handleJdbcChange}
          />
        </Grid.Col>
        <Grid.Col lg={1} />
        <Grid.Col lg={5}>
          <Labels
            environment={environment}
            application={application}
            discriminator={discriminator}
            description={description ? description : ''}
            handleLabelChange={handleLabelChange}
            displayCreatedByField={false}
          />
        </Grid.Col>
      </Grid.Row>
    </Grid>
  );
};

export default External;
