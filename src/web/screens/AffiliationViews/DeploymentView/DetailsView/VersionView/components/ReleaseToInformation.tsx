import React from 'react';
import { MessageBar } from '@skatteetaten/frontend-components/MessageBar';
import { IImageTag } from 'web/services/auroraApiClients/imageRepositoryClient/query';
import { ExternalLink } from 'web/components/ExternalLink';

const auroraConfigDocumentation =
  'https://skatteetaten.github.io/aurora/documentation/aurora-config/#configuration-for-deployment-types-deploy-and-development';

export const ReleaseToInformation: React.FC<{ currentVersion: IImageTag }> = ({
  currentVersion,
}) => (
  <MessageBar style={{ maxWidth: '600px' }}>
    <ExternalLink
      href={auroraConfigDocumentation}
      target="_blank"
      rel="noopener noreferrer"
      title="Les mer om releaseTo"
    >
      releaseTo
    </ExternalLink>{' '}
    er konfigurert i denne applikasjonen. <strong>{currentVersion.name}</strong>{' '}
    vil bli oppdatert.
  </MessageBar>
);
