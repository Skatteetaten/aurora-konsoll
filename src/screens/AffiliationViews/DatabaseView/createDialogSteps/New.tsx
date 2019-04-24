import * as React from 'react';
import styled from 'styled-components';

import { ICreateDatabaseSchemaInput } from 'models/schemas';
import Labels from '../Labels';

export interface INewProps {
  databaseSchemaInput: ICreateDatabaseSchemaInput;
  setDatabaseSchemaInput: (labels: ICreateDatabaseSchemaInput) => void;
  className?: string;
}

const New = ({
  databaseSchemaInput,
  setDatabaseSchemaInput,
  className
}: INewProps) => {
  const handleLabelChange = (field: string) => (value: string) => {
    setDatabaseSchemaInput({
      ...databaseSchemaInput,
      [field]: value
    });
  };

  const {
    environment,
    application,
    discriminator,
    description
  } = databaseSchemaInput;

  return (
    <div className={className}>
      <div className="styled-labels">
        <Labels
          environment={environment}
          application={application}
          discriminator={discriminator}
          description={description ? description : ''}
          handleLabelChange={handleLabelChange}
          displayCreatedByField={false}
        />
      </div>
    </div>
  );
};

export default styled(New)`
  .styled-labels {
    width: 470px;
    margin: 0 auto;
  }
`;
