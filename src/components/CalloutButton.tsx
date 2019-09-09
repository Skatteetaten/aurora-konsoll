import React, { useState, useRef } from 'react';

import Callout from 'aurora-frontend-react-komponenter/Callout';
import Button from 'aurora-frontend-react-komponenter/Button';

interface ICalloutProps {
  title: string;
  content: JSX.Element;
  buttonProps: { [key: string]: any };
  calloutProps: { [key: string]: any };
}

function CalloutButton(props: ICalloutProps) {
  const [isCalloutVisible, setIsCalloutVisible] = useState(false);

  const menuButtonElement = useRef<HTMLDivElement>(null);

  const onCalloutDismiss = (): void => {
    setIsCalloutVisible(false);
  };

  const onShowMenuClicked = (): void => {
    setIsCalloutVisible(!isCalloutVisible);
  };

  return (
    <div>
      <span ref={menuButtonElement}>
        <Button onClick={onShowMenuClicked} {...props.buttonProps}>
          {props.title}
        </Button>
      </span>
      {isCalloutVisible && (
        <Callout
          target={menuButtonElement.current}
          onClose={onCalloutDismiss}
          {...props.calloutProps}
        >
          {props.content}
        </Callout>
      )}
    </div>
  );
}

export default CalloutButton;
