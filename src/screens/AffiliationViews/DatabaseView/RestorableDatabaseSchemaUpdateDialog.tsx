import * as React from 'react';
import palette from '@skatteetaten/frontend-components/utils/palette';
import styled from 'styled-components';
import {
  IRestorableDatabaseSchemaData,
  IUpdateDatabaseSchemaInputWithCreatedBy,
  IDatabaseSchema
} from 'models/schemas';
import { useState, useEffect, useRef } from 'react';
import Dialog from '@skatteetaten/frontend-components/Dialog';
import { Grid } from '@skatteetaten/frontend-components/Grid';
import { getLocalDatetime } from 'utils/date';

const { skeColor } = palette;

interface IRestorableDatabaseSchemaUpdateDialogProps {
  schema?: IRestorableDatabaseSchemaData;
  //   className?: string;
  clearSelectedSchema: () => void;
  onUpdate: (databaseSchema: IUpdateDatabaseSchemaInputWithCreatedBy) => void;
  onDelete: (databaseSchema: IDatabaseSchema) => void;
  //   onTestJdbcConnectionForId: (id: string) => void;
  //   testJdbcConnectionResponse: ITestJDBCResponse;
  // createNewCopy: () => void;
}

interface IUpdatedSchemaValues {
  id: string;
  discriminator: string;
  createdBy: string;
  engine: string;
  description: string;
  environment: string;
  application: string;
  affiliation: string;
}

function RestorableDatabaseSchemaUpdateDialog({
  schema,
  clearSelectedSchema
}: IRestorableDatabaseSchemaUpdateDialogProps) {
  const initialUpdatedSchemaValues: IUpdatedSchemaValues = {
    id: '',
    discriminator: '',
    createdBy: '',
    engine: '',
    description: '',
    environment: '',
    application: '',
    affiliation: ''
  };
  const [updatedSchemaValues, setUpdatedSchemaValues] = useState<
    IUpdatedSchemaValues
  >(initialUpdatedSchemaValues);

  console.log(updatedSchemaValues);
  function usePrevious(value) {
    const ref = useRef();
    useEffect(() => {
      ref.current = value;
    });
    return ref.current;
  }

  const createNewCopy = () => {
    createNewCopy();
    clearSelectedSchema();
  };

  const prevSchema = usePrevious({ schema });

  useEffect(() => {
    if (schema) {
      // TODO se om neste ifcheck kan fjernes
      if (typeof prevSchema === 'undefined') {
        const {
          id,
          environment,
          application,
          discriminator,
          engine,
          description,
          createdBy,
          affiliation
        } = schema.databaseSchema;
        setUpdatedSchemaValues({
          id: id,
          discriminator: discriminator,
          createdBy: createdBy,
          description: description ? description : '',
          engine: engine,
          environment: environment,
          application: application,
          affiliation: affiliation.name
        });
      }
    }
  }, [schema, prevSchema]);

  if (!!!schema) {
    console.log(schema);
    return <div></div>;
  }

  const dateTimeFormat = (date?: Date | null) =>
    date ? getLocalDatetime(date) : '-';
  console.log(schema);

  return (
    <Dialog
      hidden={!!!schema}
      onDismiss={clearSelectedSchema}
      minWidth="1000px"
      maxWidth="90%"
    >
      <Grid>
        <Grid.Row>
          <Grid.Col lg={2} className="bold">
            <p>Id: </p>
            <p>Type: </p>
            <p>Engine: </p>
            <p>Opprettet: </p>
            <p>Sist brukt: </p>
            <p>Brukes av: </p>
          </Grid.Col>
          <Grid.Col lg={10}>
            <p>{schema.databaseSchema.id}</p>
            <p>{schema.databaseSchema.type}</p>
            <p>
              {schema.databaseSchema.type === 'EXTERNAL'
                ? '-'
                : schema.databaseSchema.engine}
            </p>
            <p>{dateTimeFormat(schema.databaseSchema.createdDate)}</p>
            <p>{dateTimeFormat(schema.databaseSchema.lastUsedDate)}</p>
          </Grid.Col>
        </Grid.Row>
      </Grid>
    </Dialog>
  );
}

export default styled(RestorableDatabaseSchemaUpdateDialog)`
  .bold {
    font-weight: bold;
  }

  .ms-TextField-wrapper {
    padding-bottom: 10px;
  }

  .ms-Button.is-disabled {
    color: ${skeColor.grey};
  }
`;
