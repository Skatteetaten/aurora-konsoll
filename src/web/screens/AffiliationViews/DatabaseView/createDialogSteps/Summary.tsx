import * as React from 'react';
import styled from 'styled-components';

import { Grid, Card, CardColor } from '@skatteetaten/frontend-components';
import { ICreateDatabaseSchemaResponse } from 'web/models/schemas';

interface ISummaryProps {
  createResponse: ICreateDatabaseSchemaResponse;
  className?: string;
}

const Summary = ({ createResponse, className }: ISummaryProps) => {
  const createRow = (label: string, value: string) => (
    <Grid.Row rowSpacing={Grid.SPACE_LARGE}>
      <Grid.Col lg={2}>
        <div className="styled-label">{label}</div>
      </Grid.Col>

      <Grid.Col lg={10}>
        <div className="styled-value">{value}</div>
      </Grid.Col>
    </Grid.Row>
  );

  return (
    <div className={className}>
      <Card color={CardColor.GREEN}>
        <Grid>
          {createRow('Database ID:', createResponse.id)}
          {createRow('JDBC url:', createResponse.jdbcUser.jdbcUrl)}
          {createRow('Brukernavn:', createResponse.jdbcUser.username)}
          {createRow('Passord:', createResponse.jdbcUser.password)}
        </Grid>
      </Card>
    </div>
  );
};

export default styled(Summary)`
  .styled-label {
    font-weight: bold;
    font-size: 20px;
  }

  .styled-value {
    font-size: 20px;
  }
`;
