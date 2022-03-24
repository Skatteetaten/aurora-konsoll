import React from 'react';
import { MessageBar } from '@skatteetaten/frontend-components/MessageBar';

export const InvalidRefInformation: React.FC<{
  refName: string | undefined;
}> = ({ refName }) => (
  <MessageBar type={MessageBar.Type.warning}>
    Ikke mulig å deploye nåværende eller annen versjon. Årsak: Finner ikke
    branchen <b>{refName}</b> applikasjonen ble deployet med. Løsning: Dersom
    branchen har blitt slettet: deploy applikasjonen ved hjelp av
    kommandolinjeverktøyet AO med en branch som eksisterer. Applikasjonen vil da
    kunne deployes i Aurora Konsoll.
  </MessageBar>
);
