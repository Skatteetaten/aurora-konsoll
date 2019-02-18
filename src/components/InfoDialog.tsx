import * as React from 'react';

import ActionButton from 'aurora-frontend-react-komponenter/ActionButton';
import Button from 'aurora-frontend-react-komponenter/Button';
import Dialog from 'aurora-frontend-react-komponenter/Dialog';

interface InfoDialogProps {
  title: string;
  subText?: string;
  buttonText?: string;
  buttonStyle?:
    | 'primary'
    | 'primaryRounded'
    | 'primaryRoundedFilled'
    | 'warning'
    | 'secondary';
  children: JSX.Element;
  renderOpenDialogButton?: (openDialog: () => void) => JSX.Element;
  renderFooterButtons?: (closeDialog: () => void) => JSX.Element;
  hideCloseButton?: boolean;
}

interface InfoDialogState {
  isOpen: boolean;
}

function renderDefaultOpenDialogButton(
  title: string,
  buttonStyle: string,
  openDialog: () => void
) {
  return (
    <Button buttonType={buttonStyle} onClick={openDialog}>
      {title}
    </Button>
  );
}

class InfoDialog extends React.Component<InfoDialogProps, InfoDialogState> {
  public state: InfoDialogState = {
    isOpen: false
  };

  public toggleDialog = (isOpen: boolean) => () => {
    this.setState({
      isOpen
    });
  };

  public render() {
    const { isOpen } = this.state;
    const {
      renderOpenDialogButton,
      renderFooterButtons,
      hideCloseButton,
      children,
      title,
      subText,
      buttonText,
      buttonStyle = 'secondary'
    } = this.props;
    const close = this.toggleDialog(false);
    const open = this.toggleDialog(true);
    return (
      <>
        {renderOpenDialogButton
          ? renderOpenDialogButton(open)
          : renderDefaultOpenDialogButton(
              buttonText || title,
              buttonStyle,
              open
            )}
        <Dialog
          hidden={!isOpen}
          onDismiss={close}
          title={title}
          helpText={subText}
          dialogMinWidth="500px"
          dialogMaxWidth="90%"
        >
          {children}
          <Dialog.Footer>
            {renderFooterButtons && renderFooterButtons(close)}
            {!hideCloseButton && (
              <ActionButton onClick={close}>Lukk</ActionButton>
            )}
          </Dialog.Footer>
        </Dialog>
      </>
    );
  }
}

export default InfoDialog;
