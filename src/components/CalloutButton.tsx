import React, { useState, useRef } from 'react';

import Callout from 'aurora-frontend-react-komponenter/Callout';
import Button from 'aurora-frontend-react-komponenter/Button';

interface ICalloutProps extends React.ComponentProps<'div'> {
  title: string;
  content: JSX.Element;
  buttonProps: { [key: string]: any };
  calloutProps: { [key: string]: any };
}

function CalloutButton({
  buttonProps,
  title,
  calloutProps,
  content,
  ...restProps
}: ICalloutProps) {
  const [isCalloutVisible, setIsCalloutVisible] = useState(false);

  const menuButtonElement = useRef<HTMLDivElement>(null);

  const onCalloutDismiss = (): void => {
    setIsCalloutVisible(false);
  };

  const onShowMenuClicked = (): void => {
    setIsCalloutVisible(!isCalloutVisible);
  };

  return (
    <div {...restProps}>
      <span ref={menuButtonElement}>
        <Button onClick={onShowMenuClicked} {...buttonProps}>
          {title}
        </Button>
      </span>
      {isCalloutVisible && (
        <Callout
          target={menuButtonElement.current}
          onClose={onCalloutDismiss}
          {...calloutProps}
        >
          {content}
        </Callout>
      )}
    </div>
  );
}

export default CalloutButton;
