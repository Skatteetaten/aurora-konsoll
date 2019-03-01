import * as React from 'react';
import styled from 'styled-components';

import Card from 'aurora-frontend-react-komponenter/Card';
import Grid from 'aurora-frontend-react-komponenter/Grid';
import { IDeleteDatabaseSchemasResponse } from 'models/schemas';

interface IDeletionSummaryProps {
  deleteResponse: IDeleteDatabaseSchemasResponse;
  className?: string;
}

const DeletionSummary = ({
  deleteResponse,
  className
}: IDeletionSummaryProps) => {
  const createRows = (label: string, value: string[]) => (
    <>
      <Grid.Row rowSpacing={Grid.SPACE_LARGE}>
        <div className="styled-label">{label}</div>
      </Grid.Row>
      <Grid.Row rowSpacing={Grid.SPACE_LARGE}>
        <div className="styled-value">{value.join(', ')}</div>
      </Grid.Row>
    </>
  );

  return (
    <div className={className}>
      <Card color={Card.GREEN}>
        <Grid>
          {createRows(
            'Følgende databaseskjemaer ble slettet:',
            ['123', '123123']
            // deleteResponse.succeeded (above only for testing)
          )}
          {createRows(
            'Klarte ikke å slette databaseskjemaene:',
            ['123', '123123']
            // deleteResponse.failed (above only for testing)
          )}
        </Grid>
      </Card>
    </div>
  );
};

export default styled(DeletionSummary)`
  .styled-label {
    font-weight: bold;
    font-size: 20px;
  }

  .styled-value {
    font-size: 20px;
  }
`;
