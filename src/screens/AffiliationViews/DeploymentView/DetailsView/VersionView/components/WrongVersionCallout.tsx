import React, { useState, useRef, FC } from 'react';
import Callout from 'aurora-frontend-react-komponenter/Callout';
import IconButton from 'aurora-frontend-react-komponenter/IconButton';

export const WrongVersionCallout: FC = ({ children }) => {
  const [open, setOpen] = useState(false);
  const calloutRef = useRef(null);

  return (
    <>
      {open && (
        <Callout
          calloutWidth={400}
          target={calloutRef.current}
          directionalHint={Callout.POS_BOTTOM_LEFT}
          color={Callout.ERROR}
          onClose={() => setOpen(false)}
        >
          {children}
        </Callout>
      )}
      <div ref={calloutRef}>
        <IconButton icon="Warning" onClick={() => setOpen(!open)} />
      </div>
    </>
  );
};
