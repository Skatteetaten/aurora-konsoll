import React from 'react';
import MessageBar from '@skatteetaten/frontend-components/MessageBar';

export const PermissionToUpgradeInformation = () => (
  <MessageBar>
    Ikke mulig å deploye nåværende eller annen versjon. Årsak: Mangler admin
    rettigheter.
  </MessageBar>
);
