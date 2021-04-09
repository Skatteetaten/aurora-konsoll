import * as React from 'react';
import styled from 'styled-components';

import Card, { CardColor } from '@skatteetaten/frontend-components/Card';
import Grid from '@skatteetaten/frontend-components/Grid';
import {
  IDatabaseSchemas,
  IChangeCooldownDatabaseSchemasResponse,
} from 'models/schemas';
import { renderDetailsListWithSchemaInfo } from './Schema';
import Spinner from '@skatteetaten/frontend-components/Spinner';
import { SpinnerSize } from 'office-ui-fabric-react';

interface IChangeCooldownSummaryProps {
  changeCooldownResponse: IChangeCooldownDatabaseSchemasResponse;
  className?: string;
  items: IDatabaseSchemas;
  changeCooldownType: string;
}

const ChangeCooldownSummary = ({
  changeCooldownResponse,
  className,
  items,
  changeCooldownType,
}: IChangeCooldownSummaryProps) => {
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
          {changeCooldownResponse.succeeded.length > 0 &&
            createRows(
              `Følgende databaseskjemaer ble ${changeCooldownType}t:`,
              changeCooldownResponse.succeeded
            )}
          {changeCooldownResponse.failed.length > 0 &&
            createRows(
              `Klarte ikke å ${changeCooldownType} databaseskjemaene:`,
              changeCooldownResponse.failed
            )}
          {changeCooldownResponse.succeeded.length === 0 &&
            changeCooldownResponse.failed.length === 0 && (
              <Spinner size={SpinnerSize.large} />
            )}
        </Grid>
      </Card>
    </div>
  );
};

export default styled(ChangeCooldownSummary)`
  .styled-label {
    font-weight: bold;
    font-size: 20px;
  }

  .styled-value {
    font-size: 20px;
  }
`;
