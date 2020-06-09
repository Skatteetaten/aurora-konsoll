import * as React from 'react';

import MessageBar from '@skatteetaten/frontend-components/MessageBar';

import { IUnavailableServiceMessage } from 'models/UnavailableServiceMessage';

interface IUnavailableServiceMessageProps {
  message: IUnavailableServiceMessage;
  type?: 'info' | 'warning';
  className?: string;
}

const UnavailableServiceMessage = ({
  message,
  className,
  type = 'info',
}: IUnavailableServiceMessageProps) => (
  <div
    className={className}
    style={{ background: 'white', border: '1px solid black' }}
  >
    <MessageBar isMultiline={true} type={MessageBar.Type[type]}>
      {message.description}
      <div style={{ marginBottom: '10px' }} />
      Årsak: {message.reason}
    </MessageBar>
  </div>
);

export default UnavailableServiceMessage;
