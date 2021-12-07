import React, { useState, FormEvent } from 'react';
import styled from 'styled-components';

import {
  ICreateDatabaseSchemaInput,
  IDatabaseInstances,
} from 'web/models/schemas';
import Labels from '../Labels';
import { TextFieldEvent } from 'web/types/react';
import { Grid, RadioButtonGroup } from '@skatteetaten/frontend-components';

export interface INewProps {
  databaseSchemaInput: ICreateDatabaseSchemaInput;
  setDatabaseSchemaInput: (labels: ICreateDatabaseSchemaInput) => void;
  instances: IDatabaseInstances;
  className?: string;
}

const New = ({
  databaseSchemaInput,
  setDatabaseSchemaInput,
  instances,
  className,
}: INewProps) => {
  const [selectedInstance, setInstance] = useState<string>(
    databaseSchemaInput.instanceName ?? 'oracle'
  );

  const handleLabelChange =
    (field: string) => (event: TextFieldEvent, newValue?: string) => {
      setDatabaseSchemaInput({
        ...databaseSchemaInput,
        [field]: newValue,
      });
    };

  const onInstanceChanged = (
    e: FormEvent<HTMLElement | HTMLInputElement> | undefined,
    option
  ) => {
    if (option) {
      setInstance(option.key);
      setDatabaseSchemaInput({
        ...databaseSchemaInput,
        engine: option.engine,
        instanceName: option.instanceName,
      });
    }
  };

  const { environment, application, discriminator, description } =
    databaseSchemaInput;

  interface IInstanceRadioButton {
    key: string;
    text: string;
    description: string;
    engine: string;
    instanceName?: string | null;
  }

  const options = (): IInstanceRadioButton[] => {
    const oracleInstance = {
      key: 'oracle',
      text: 'Oracle (drivei1/drivei2)',
      description: 'uil0map-drivein-db01:1521 eller uil0map-drivein-db02:1521',
      engine: 'ORACLE',
      instanceName: null,
    };

    const databaseInstances: IInstanceRadioButton[] | undefined =
      instances.databaseInstances?.map((it) => ({
        key: it.instanceName,
        text: `Postgres (${it.instanceName})`,
        description: `${it.host}:${it.port} labels=[${it.labels
          .map((it) => {
            return `{${it.key}:${it.value}}`;
          })
          .join(', ')}]`,
        engine: it.engine,
        instanceName: it.instanceName,
      }));

    if (databaseInstances) {
      databaseInstances.unshift(oracleInstance);
      return databaseInstances;
    }
    return [oracleInstance];
  };

  return (
    <div className={className}>
      <Grid>
        <Grid.Row>
          <Grid.Col lg={6}>
            <h3>Database instanse</h3>
            <RadioButtonGroup
              label="Velg hvilke database instanse skjemaet skal opprettes på"
              help="Oracle skjemaer vil bli opprettet på en av de to nevnte database instansene. Hvilke kan ikke velges."
              options={options()}
              onChange={onInstanceChanged}
              selectedKey={selectedInstance}
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
    </div>
  );
};

export default styled(New)`
  .styled-labels {
    width: 470px;
    margin: 0 auto;
  }
`;
