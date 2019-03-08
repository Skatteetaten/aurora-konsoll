import * as React from 'react';
import styled from 'styled-components';

import Card from 'aurora-frontend-react-komponenter/Card';
import Grid from 'aurora-frontend-react-komponenter/Grid';
import {
  IDatabaseSchemas,
  IDeleteDatabaseSchemasResponse
} from 'models/schemas';
import { renderDetailsListWithSchemaInfo } from './DatabaseSchemaTable';

interface IDeletionSummaryProps {
  deleteResponse: IDeleteDatabaseSchemasResponse;
  className?: string;
  items: IDatabaseSchemas;
}

const DeletionSummary = ({
  deleteResponse,
  className,
  items
}: IDeletionSummaryProps) => {
  const getDatabaseSchemaInfoById = (ids: string[]) => {
    const extendedInfoList = items.databaseSchemas.filter(
      it => -1 !== ids.indexOf(it.id)
    );
    return renderDetailsListWithSchemaInfo(extendedInfoList);
  };

  const createRows = (label: string, ids: string[]) => (
    <>
      <Grid.Row rowSpacing={Grid.SPACE_LARGE}>
        <div className="styled-label">{label}</div>
      </Grid.Row>
      <Grid.Row rowSpacing={Grid.SPACE_LARGE}>
        <div className="styled-value">{getDatabaseSchemaInfoById(ids)}</div>
      </Grid.Row>
    </>
  );

  return (
    <div className={className}>
      <Card color={Card.GREEN}>
        <Grid>
          {createRows(
            'Følgende databaseskjemaer ble slettet:',
            deleteResponse.succeeded
          )}
          {createRows(
            'Klarte ikke å slette databaseskjemaene:',
            deleteResponse.failed
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