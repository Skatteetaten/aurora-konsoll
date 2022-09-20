import MessageBar from '@skatteetaten/frontend-components/MessageBar';
import React from 'react';
import styled from 'styled-components';

const IntegrationDisabledInformation: React.FC<{ className?: string }> = ({
  className,
}) => (
  <div className={className}>
    <div className="message-bar-margin">
      <MessageBar type={MessageBar.Type.info}>
        Spotless integrasjon er skrudd av i dette klusteret, DNS entries for
        Azure vil dermed ikke være tilgjengelig.
      </MessageBar>
    </div>
  </div>
);

export default styled(IntegrationDisabledInformation)`
  .message-bar-margin {
    margin: 10px 0;
  }
`;
