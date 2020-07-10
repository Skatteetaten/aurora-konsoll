import React from 'react';
import Callout from '@skatteetaten/frontend-components/Callout';

import CalloutButton from 'components/CalloutButton';

export const FetchVersionsInformation = () => (
  <CalloutButton
    calloutProps={{
      color: Callout.INFO,
      gapSpace: 8,
      directionalHint: Callout.POS_BOTTOM_CENTER
    }}
    buttonProps={{
      icon: 'info',
      buttonStyle: 'secondary'
    }}
    title="Vis info"
    content={
      <p>
        Hver gang man henter flere versjoner så vil det alltid hentes de nyeste
        versjonene i tillegg. Det hentes maks 100 versjoner av gangen.
      </p>
    }
  />
);
