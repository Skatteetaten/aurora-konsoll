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
  <MessageBar type={MessageBar.Type[type]}>
    {message.message}
    <p>Årsak: {message.reason}</p>
  </MessageBar>
);

export default UnavailableServiceMessage;
