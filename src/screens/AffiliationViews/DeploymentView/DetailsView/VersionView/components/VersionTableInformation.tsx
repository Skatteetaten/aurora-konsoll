import React from 'react';
import { Callout } from '@skatteetaten/frontend-components';

import CalloutButton from 'components/CalloutButton';

export const VersionTableInformation = () => (
  <CalloutButton
    style={{
      marginBottom: '6px',
    }}
    calloutProps={{
      color: Callout.INFO,
      gapSpace: 8,
      directionalHint: Callout.POS_BOTTOM_LEFT,
    }}
    buttonProps={{
      icon: 'info',
      buttonStyle: 'secondary',
    }}
    title="Finner du ikke versjoner du leter etter?"
    content={
      <>
        <p>
          På grunn av overgang til nytt Docker registry (fra Dockers eget
          registry til Nexus Docker registry) har vi ikke lengre mulighet til å
          hente ut en versjonsliste sortert på dato (denne featuren baserte seg
          tidligere på en funksjon i Dockers eget registry som ikke er i Nexus
          Docker registry). Denne informasjonen må nå hentes ut individuelt for
          hver versjon, noe som er tid- og ressurskrevende. Inntil videre er det
          derfor ikke mulig å tilby en korrekt versjonsliste hvor nyeste
          versjoner alltid kommer først.
        </p>
        <p>
          Dersom du ikke finner versjonen kan du forsøke å søke eller trykke på
          "Hent flere versjoner". Det kan være du må trykke flere ganger før
          versjonen du er på jakt etter dukker opp. Et søk vil ofte være bedre.
        </p>
      </>
    }
  />
);
