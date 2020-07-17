import * as React from 'react';
import styled from 'styled-components';

import Card, { CardColor } from '@skatteetaten/frontend-components/Card';
import Grid from '@skatteetaten/frontend-components/Grid';
import {
  IDatabaseSchemas,
  IChangeCooldownDatabaseSchemasResponse,
} from 'models/schemas';
import { renderDetailsListWithSchemaInfo } from './Schema';

interface IDeletionSummaryProps {
  deleteResponse: IChangeCooldownDatabaseSchemasResponse;
  className?: string;
  items: IDatabaseSchemas;
  changeCooldownType: string;
}

const DeletionSummary = ({
  deleteResponse,
  className,
  items,
  changeCooldownType,
}: IDeletionSummaryProps) => {
  const getDatabaseSchemaInfoById = (ids: string[]): JSX.Element | null => {
    if (!items.databaseSchemas) {
      return null;
    }
    const extendedInfoList = items.databaseSchemas.filter(
      (it) => -1 !== ids.indexOf(it.id)
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
      <Card color={CardColor.GREEN}>
        <Grid>
          {createRows(
            `Følgende databaseskjemaer ble ${changeCooldownType}t:`,
            deleteResponse.succeeded
          )}
          {createRows(
            `Klarte ikke å ${changeCooldownType} databaseskjemaene:`,
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
