import * as React from 'react';

import ActionButton from '@skatteetaten/frontend-components/ActionButton';
import Button, { ButtonProps } from '@skatteetaten/frontend-components/Button';
import Dialog from '@skatteetaten/frontend-components/Dialog';
import styled from 'styled-components';

const DialogSubText = styled<React.FC<{ className?: string }>>(
  ({ children, className }) => <div className={className}>{children}</div>
)`
  font-size: 16px;
  position: relative;
  margin: 0;
  display: inline-block;
  height: 40px;
  float: left;
  top: 10px;
`;

interface InfoDialogProps {
  title: string;
  subText?: string;
  buttonText?: string;
  isBlocking?: boolean;
  buttonStyle?: ButtonProps['buttonStyle'];
  children?: JSX.Element;
  renderOpenDialogButton?: (openDialog: () => void) => JSX.Element;
  renderFooterButtons?: (closeDialog: () => void) => JSX.Element;
  hideCloseButton?: boolean;
  onDismiss?: () => void;
}

interface InfoDialogState {
  isOpen: boolean;
}

function renderDefaultOpenDialogButton(
  title: string,
  buttonStyle: ButtonProps['buttonStyle'],
  openDialog: () => void
) {
  return (
    <Button buttonStyle={buttonStyle} onClick={openDialog}>
      {title}
    </Button>
  );
}

class InfoDialog extends React.Component<InfoDialogProps, InfoDialogState> {
  public state: InfoDialogState = {
    isOpen: false,
  };

  public toggleDialog = (isOpen: boolean) => () => {
    this.setState({
      isOpen,
    });
  };

  private close = this.toggleDialog(false);
  private dismissDialog = () => {
    const { onDismiss } = this.props;
    this.close();
    if (onDismiss) {
      onDismiss();
    }
  };

  public render() {
    const { isOpen } = this.state;
    const {
      renderOpenDialogButton,
      renderFooterButtons,
      hideCloseButton,
      isBlocking,
      children,
      title,
      subText,
      buttonText,
      buttonStyle = 'secondary',
    } = this.props;
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
        {/* Using isOpen because Dialog renders a div-element when it's not open. */}
        {isOpen && (
          <Dialog
            hidden={!isOpen}
            onDismiss={this.dismissDialog}
            title={title}
            minWidth="500px"
            maxWidth="90%"
            isBlocking={!!isBlocking}
          >
            {children}
            <Dialog.Footer>
              <DialogSubText>{subText}</DialogSubText>
              {renderFooterButtons && renderFooterButtons(this.close)}
              {!hideCloseButton && (
                <ActionButton onClick={this.close}>Lukk</ActionButton>
              )}
            </Dialog.Footer>
          </Dialog>
        )}
      </>
    );
  }
}

export default InfoDialog;
