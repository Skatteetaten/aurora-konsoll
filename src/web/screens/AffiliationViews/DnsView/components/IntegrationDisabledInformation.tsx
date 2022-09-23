import MessageBar from '@skatteetaten/frontend-components/MessageBar';
import React from 'react';

export const IntegrationDisabledInformation: React.FC<{
  className?: string;
  type: 'onPrem' | 'azure';
}> = ({ className, type }) => {
  const message = () => {
    if (type === 'azure') {
      return 'Det ikke er mulig å nå applikasjoner i dette clusteret fra Azure. Det vil derfor ikke vises noen DNS entries her.';
    } else {
      return 'Integrasjonen for å hente On Premise entries er skrudd av. Det vil derfor ikke vises noen DNS entries her.';
    }
  };

  return <MessageBar type={MessageBar.Type.info}>{message()}</MessageBar>;
};
