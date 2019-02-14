import * as React from 'react';

import TextField from 'aurora-frontend-react-komponenter/TextField';

interface ILabelsProps {
  environment?: string;
  application?: string;
  discriminator?: string;
  createdBy?: string;
  description?: string;
  handleLabelChange: (field: string) => (value: string) => void;
}

const Labels = ({
  environment,
  application,
  discriminator,
  createdBy,
  description,
  handleLabelChange
}: ILabelsProps) => (
  <>
    <h3>Labels</h3>
    <TextField
      id={'environment'}
      label={'Miljø'}
      value={environment}
      onChanged={handleLabelChange('environment')}
    />
    <TextField
      id={'application'}
      label={'Applikasjon'}
      value={application}
      onChanged={handleLabelChange('application')}
    />
    <TextField
      id={'discriminator'}
      label={'Diskriminator'}
      value={discriminator}
      onChanged={handleLabelChange('discriminator')}
    />
    <TextField
      id={'createdBy'}
      label={'Bruker'}
      value={createdBy}
      onChanged={handleLabelChange('createdBy')}
    />
    <TextField
      id={'description'}
      label={'Beskrivelse'}
      value={description}
      onChanged={handleLabelChange('description')}
      multiline={true}
    />
  </>
);

export default Labels;
