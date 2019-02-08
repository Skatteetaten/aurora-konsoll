import * as React from 'react';

import Grid from 'aurora-frontend-react-komponenter/Grid';
import { ICreateDatabaseSchemaInput, IJdbcUser } from 'models/schemas';
import JdbcConnection from '../JdbcConnection';
import Labels from '../Labels';

interface IExternalProps {
  setDatabaseSchemaInput: (
    databaseSchemaInput: ICreateDatabaseSchemaInput
  ) => void;
  databaseSchemaInput: ICreateDatabaseSchemaInput;
  onTestJdbcConnectionForUser: (jdbcUser: IJdbcUser) => void;
  testJdbcConnectionResponse: boolean;
}

const External = ({
  setDatabaseSchemaInput,
  databaseSchemaInput,
  onTestJdbcConnectionForUser,
  testJdbcConnectionResponse
}: IExternalProps) => {
  const handleLabelChange = (field: string) => (value: string) => {
    setDatabaseSchemaInput({
      ...databaseSchemaInput,
      [field]: value
    });
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
            disabled={false}
          />
        </Grid.Col>
        <Grid.Col lg={1} />
        <Grid.Col lg={5}>
          <Labels handleLabelChange={handleLabelChange} />
        </Grid.Col>
      </Grid.Row>
    </Grid>
  );
};

export default External;
