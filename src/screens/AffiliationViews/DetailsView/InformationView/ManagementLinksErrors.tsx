import * as React from 'react';

import MessageBar from 'aurora-frontend-react-komponenter/MessageBar';

import { IManagementEndpointError } from 'models/Pod';

interface ManagementLinksErrorsProps {
  error: IManagementEndpointError;
}

export const ManagementLinksErrors = ({
  error
}: ManagementLinksErrorsProps) => (
  <div style={{ maxWidth: '500px' }}>
    <MessageBar type={MessageBar.Type.error} isMultiline={true}>
      Feilkode: {error.code}
      <br />
      Melding: {error.message}
    </MessageBar>
  </div>
);
