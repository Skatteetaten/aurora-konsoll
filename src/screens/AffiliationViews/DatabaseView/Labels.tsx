import * as React from 'react';
import styled from 'styled-components';

import TextField from 'aurora-frontend-react-komponenter/TextField';

interface ILabelsProps {
  className?: string;
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
  handleLabelChange,
  className
}: ILabelsProps) => (
  <div className={className}>
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
      help="Benyttes av systemet for å finne et databaseskjema"
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
  </div>
);

export default styled(Labels)`
  .ms-Callout-main {
    width: 380px;
  }
`;
