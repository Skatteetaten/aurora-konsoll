import * as React from 'react';
import styled from 'styled-components';

import { ICreateDatabaseSchemaInput } from 'models/schemas';
import Labels from '../Labels';

export interface INewProps {
  labels: ICreateDatabaseSchemaInput;
  setLabels: (labels: ICreateDatabaseSchemaInput) => void;
  className?: string;
}

const New = ({ labels, setLabels, className }: INewProps) => {
  const handleLabelChange = (field: string) => (value: string) => {
    setLabels({
      ...labels,
      [field]: value
    });
  };

  return (
    <div className={className}>
      <div className="styled-labels">
        <Labels handleLabelChange={handleLabelChange} />
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
