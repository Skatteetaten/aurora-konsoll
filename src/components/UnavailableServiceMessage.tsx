import * as React from 'react';

import MessageBar from 'aurora-frontend-react-komponenter/MessageBar';

import { IUnavailableServiceMessage } from 'models/UnavailableServiceMessage';

interface IUnavailableServiceMessageProps {
  message: IUnavailableServiceMessage;
  type?: 'info' | 'warning';
}

const UnavailableServiceMessage = ({
  message,
  type = 'info'
}: IUnavailableServiceMessageProps) => (
  <div style={{ background: 'white', border: '1px solid black' }}>
    <MessageBar isMultiline={true} type={MessageBar.Type[type]}>
      {message.message}
      <div style={{ marginBottom: '10px' }} />
      Årsak: {message.reason}
    </MessageBar>
  </div>
);

export default UnavailableServiceMessage;
