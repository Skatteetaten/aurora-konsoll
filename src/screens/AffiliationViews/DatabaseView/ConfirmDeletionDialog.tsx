import * as React from 'react';

import InfoDialog from 'components/InfoDialog';

interface IConfirmDeletionDialogProps {
  title: string;
  isBlocking: boolean;
  children: JSX.Element;
  renderOpenDialogButton?: (openDialog: () => void) => JSX.Element;
  renderFooterButtons?: (closeDialog: () => void) => JSX.Element;
}

const ConfirmDeletionDialog = (props: IConfirmDeletionDialogProps) => {
  const {
    title,
    renderOpenDialogButton,
    renderFooterButtons,
    isBlocking,
    children
  } = props;

  return (
    <InfoDialog
      title={title}
      renderOpenDialogButton={renderOpenDialogButton}
      renderFooterButtons={renderFooterButtons}
      hideCloseButton={true}
      isBlocking={isBlocking}
    >
      {children}
    </InfoDialog>
  );
};

export default ConfirmDeletionDialog;
