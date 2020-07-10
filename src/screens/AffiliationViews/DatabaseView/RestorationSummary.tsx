import * as React from 'react';
import styled from 'styled-components';

import Card, { CardColor } from '@skatteetaten/frontend-components/Card';
import Grid from '@skatteetaten/frontend-components/Grid';
import {
  IChangeCooldownDatabaseSchemasResponse,
  IRestorableDatabaseSchemas,
} from 'models/schemas';
import { renderDetailsListWithSchemaInfo } from './RestorableSchema';

interface IRestorationSummaryProps {
  restoreResponse: IChangeCooldownDatabaseSchemasResponse;
  className?: string;
  items: IRestorableDatabaseSchemas;
}

const RestorationSummary = ({
  restoreResponse,
  className,
  items,
}: IRestorationSummaryProps) => {
  const getDatabaseSchemaInfoById = (ids: string[]): JSX.Element | null => {
    if (!items.restorableDatabaseSchemas) {
      return null;
    }
    const extendedInfoList = items.restorableDatabaseSchemas.filter(
      (it) => -1 !== ids.indexOf(it.databaseSchema.id)
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
            'Følgende databaseskjemaer ble gjenopprettet:',
            restoreResponse.succeeded
          )}
          {createRows(
            'Klarte ikke å gjenopprette databaseskjemaene:',
            restoreResponse.failed
          )}
        </Grid>
      </Card>
    </div>
  );
};

export default styled(RestorationSummary)`
  .styled-label {
    font-weight: bold;
    font-size: 20px;
  }

  .styled-value {
    font-size: 20px;
  }
`;
