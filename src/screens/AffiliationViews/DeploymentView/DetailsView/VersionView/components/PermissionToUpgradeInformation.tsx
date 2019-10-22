import React from 'react';
import MessageBar from 'aurora-frontend-react-komponenter/MessageBar';

export const PermissionToUpgradeInformation = () => (
  <MessageBar>
    Ikke mulig å deploye nåværende eller annen versjon. Årsak: Mangler admin
    rettigheter.
  </MessageBar>
);
