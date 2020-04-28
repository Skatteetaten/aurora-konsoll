import * as React from 'react';

import Grid from '@skatteetaten/frontend-components/Grid';
import {
  ICreateDatabaseSchemaInput,
  IJdbcUser,
  ITestJDBCResponse
} from 'models/schemas';
import DatabaseSchemaService from 'services/DatabaseSchemaService';
import JdbcConnection from '../JdbcConnection';
import Labels from '../Labels';
import { TextFieldEvent } from 'types/react';

interface IExternalProps {
  setDatabaseSchemaInput: (
    databaseSchemaInput: ICreateDatabaseSchemaInput
  ) => void;
  setJdbcUserInput: (jdbcUser: IJdbcUser) => void;
  databaseSchemaInput: ICreateDatabaseSchemaInput;
  onTestJdbcConnectionForUserV2: (jdbcUser: IJdbcUser) => void;
  testJdbcConnectionResponseV2: ITestJDBCResponse;
  databaseSchemaService: DatabaseSchemaService;
}

const External = ({
  setDatabaseSchemaInput,
  databaseSchemaInput,
  onTestJdbcConnectionForUserV2,
  testJdbcConnectionResponseV2,
  databaseSchemaService,
  setJdbcUserInput
}: IExternalProps) => {
  const handleLabelChange = (field: string) => (
    event: TextFieldEvent,
    newValue?: string
  ) => {
    setDatabaseSchemaInput({
      ...databaseSchemaInput,
      [field]: newValue
    });
  };

  const handleJdbcChange = (field: string) => (
    event: TextFieldEvent,
    newValue?: string
  ) => {
    setJdbcUserInput({
      ...databaseSchemaInput.jdbcUser,
      [field]: newValue
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
            onTestJdbcConnectionForUserV2={onTestJdbcConnectionForUserV2}
            testJdbcConnectionResponseV2={testJdbcConnectionResponseV2}
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
