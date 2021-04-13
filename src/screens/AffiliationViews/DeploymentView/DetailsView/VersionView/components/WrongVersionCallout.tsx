import React, { useState, useRef, FC } from 'react';
import { Callout, IconButton } from '@skatteetaten/frontend-components';

export const WrongVersionCallout: FC = ({ children }) => {
  const [open, setOpen] = useState(false);
  const calloutRef = useRef(null);

  return (
    <>
      {open && (
        <Callout
          calloutWidth={500}
          target={calloutRef.current}
          directionalHint={Callout.POS_BOTTOM_LEFT}
          color={Callout.ERROR}
          onClose={() => setOpen(false)}
        >
          {children}
        </Callout>
      )}
      <div ref={calloutRef}>
        <IconButton icon="Info" onClick={() => setOpen(!open)} />
      </div>
    </>
  );
};
