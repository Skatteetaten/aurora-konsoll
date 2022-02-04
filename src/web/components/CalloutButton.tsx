import React, { useState, useRef } from 'react';

import { Callout } from '@skatteetaten/frontend-components/Callout';
import ActionButton from '@skatteetaten/frontend-components/ActionButton';

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
        <ActionButton onClick={onShowMenuClicked} {...buttonProps}>
          {title}
        </ActionButton>
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
