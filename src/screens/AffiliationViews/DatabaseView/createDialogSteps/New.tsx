import * as React from 'react';

import { ICreateDatabaseSchemaInput } from 'models/schemas';
import Labels from '../Labels';

export interface INewProps {
  labels: ICreateDatabaseSchemaInput;
  setLabels: (labels: ICreateDatabaseSchemaInput) => void;
}

const New = ({ labels, setLabels }: INewProps) => {
  const handleLabelChange = (field: string) => (value: string) => {
    setLabels({
      ...labels,
      [field]: value
    });
  };

  return <Labels handleLabelChange={handleLabelChange} />;
};

export default New;
