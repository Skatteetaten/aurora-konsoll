import React, { useState, useRef } from 'react';
import Callout from 'aurora-frontend-react-komponenter/Callout';
import Button from 'aurora-frontend-react-komponenter/Button';

export const WrongVersionCallout = () => {
  const [open, setOpen] = useState(false);
  const calloutRef = useRef(null);

  return (
    <div>
      <span ref={calloutRef}>
        <Button
          buttonType="secondary"
          aria-haspopup="true"
          icon="Info"
          onClick={() => setOpen(!open)}
        >
          Nei
        </Button>
      </span>

      {open && (
        <Callout
          calloutWidth={500}
          target={calloutRef.current}
          directionalHint={Callout.POS_TOP_CENTER}
          color={Callout.ERROR}
          onClose={() => setOpen(false)}
        >
          <h3>Kjører ikke ønsket versjon</h3>
          <p>Fornuftig tekst</p>
        </Callout>
      )}
    </div>
  );
};
