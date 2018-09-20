import * as React from 'react';

import ActionButton from 'aurora-frontend-react-komponenter/ActionButton';
import Button from 'aurora-frontend-react-komponenter/Button';
import Dialog from 'aurora-frontend-react-komponenter/Dialog';

interface InfoDialogProps {
  title: string;
  children: JSX.Element;
}

interface InfoDialogState {
  isOpen: boolean;
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
    const { children, title } = this.props;
    return (
      <>
        <Button buttonType="secondary" onClick={this.toggleDialog(true)}>
          {title}
        </Button>
        <Dialog
          hidden={!isOpen}
          onDismiss={this.toggleDialog(false)}
          title={title}
          dialogMinWidth="600px"
        >
          {children}
          <Dialog.Footer>
            <ActionButton onClick={this.toggleDialog(false)}>Lukk</ActionButton>
            <Button buttonType="primaryRounded">Oppdater</Button>
          </Dialog.Footer>
        </Dialog>
      </>
    );
  }
}

export default InfoDialog;