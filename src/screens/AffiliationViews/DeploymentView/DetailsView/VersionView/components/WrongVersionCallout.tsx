import React, { useState, useRef, FC } from 'react';
import Callout from '@skatteetaten/frontend-components/Callout';
import IconButton from '@skatteetaten/frontend-components/IconButton';

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
