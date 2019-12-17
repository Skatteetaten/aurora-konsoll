import React from 'react';
import MessageBar from '@skatteetaten/frontend-components/MessageBar';
import { IImageTag } from 'services/auroraApiClients/imageRepositoryClient/query';

export interface ReleaseToInformationProps {
  currentVersion: IImageTag;
}

export const ReleaseToInformation: React.FC<ReleaseToInformationProps> = ({
  currentVersion
}) => (
  <MessageBar style={{ maxWidth: '600px' }}>
    releaseTo er konfigurert til <strong>{currentVersion.name}</strong> i
    denne applikasjonen.
  </MessageBar>
);
