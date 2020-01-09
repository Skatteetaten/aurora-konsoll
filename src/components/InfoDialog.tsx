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
  infoDialogStyle?: React.CSSProperties;
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
      isBlocking,
      children,
      title,
      subText,
      buttonText,
      buttonStyle = 'secondary',
      infoDialogStyle
    } = this.props;
    const close = this.toggleDialog(false);
    const open = this.toggleDialog(true);
    return (
      <div style={infoDialogStyle}>
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
            onDismiss={close}
            title={title}
            minWidth="500px"
            maxWidth="90%"
            isBlocking={!!isBlocking}
          >
            {children}
            <Dialog.Footer>
              <DialogSubText>{subText}</DialogSubText>
              {renderFooterButtons && renderFooterButtons(close)}
              {!hideCloseButton && (
                <ActionButton onClick={close}>Lukk</ActionButton>
              )}
            </Dialog.Footer>
          </Dialog>
        )}
      </div>
    );
  }
}

export default InfoDialog;
