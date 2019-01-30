import * as React from 'react';
import InfoDialog from './InfoDialog';

import styled from 'styled-components';

interface IConfirmationDialogProps {
  title: string;
  text: string;
  renderOpenDialogButton?: (openDialog: () => void) => JSX.Element;
  renderFooterButtons?: (closeDialog: () => void) => JSX.Element;
}

const ConfirmationDialog = (props: IConfirmationDialogProps) => {
  const { title, text, renderOpenDialogButton, renderFooterButtons } = props;

  return (
    <InfoDialog
      title={title}
      renderOpenDialogButton={renderOpenDialogButton}
      renderFooterButtons={renderFooterButtons}
      hideCloseButton={true}
    >
      <Message>{text}</Message>
    </InfoDialog>
  );
};

const Message = styled.div`
  display: flex;
  margin: 10px 0;
`;

export default ConfirmationDialog;
