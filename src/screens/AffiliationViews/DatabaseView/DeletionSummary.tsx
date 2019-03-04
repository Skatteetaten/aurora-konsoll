import * as React from 'react';
import styled from 'styled-components';

import Card from 'aurora-frontend-react-komponenter/Card';
import Grid from 'aurora-frontend-react-komponenter/Grid';
import {
  IDatabaseSchema,
  IDatabaseSchemas,
  IDeleteDatabaseSchemasResponse
} from 'models/schemas';
import { renderDeletionSchemaInfo } from './DatabaseSchemaTable';

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
  const getDatabaseSchemaInfoById = (value: string[]) => {
    const extendedInfoList: IDatabaseSchema[] = [];
    for (const id of value) {
      const foundId = items.databaseSchemas.find(
        (it: IDatabaseSchema) => it.id === id
      );
      if (foundId) {
        extendedInfoList.push(foundId);
      }
    }
    return renderDeletionSchemaInfo(extendedInfoList);
  };

  const createRows = (label: string, value: string[]) => (
    <>
      <Grid.Row rowSpacing={Grid.SPACE_LARGE}>
        <div className="styled-label">{label}</div>
      </Grid.Row>
      <Grid.Row rowSpacing={Grid.SPACE_LARGE}>
        <div className="styled-value">{getDatabaseSchemaInfoById(value)}</div>
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
