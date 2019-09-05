import * as React from 'react';

import Callout from 'aurora-frontend-react-komponenter/Callout';
import Button from 'aurora-frontend-react-komponenter/Button';

interface ICalloutProps {
  title: string;
  content: JSX.Element;
  buttonProps: { [key: string]: any };
  calloutProps: { [key: string]: any };
}

interface ICalloutState {
  isCalloutVisible: boolean;
}

class CalloutButton extends React.Component<ICalloutProps, ICalloutState> {
  public state: ICalloutState = {
    isCalloutVisible: false
  };

  private menuButtonElement = React.createRef<HTMLDivElement>();

  private onCalloutDismiss = (): void => {
    this.setState({ isCalloutVisible: !this.state.isCalloutVisible });
  };

  private onShowMenuClicked = (): void => {
    this.setState({
      isCalloutVisible: !this.state.isCalloutVisible
    });
  };

  public render() {
    const { content, title, calloutProps, buttonProps } = this.props;
    const { isCalloutVisible } = this.state;
    return (
      <div>
        <span ref={this.menuButtonElement}>
          <Button onClick={this.onShowMenuClicked} {...buttonProps}>
            {title}
          </Button>
        </span>
        {isCalloutVisible && (
          <Callout
            target={this.menuButtonElement.current}
            onClose={this.onCalloutDismiss}
            {...calloutProps}
          >
            {content}
          </Callout>
        )}
      </div>
    );
  }
}

export default CalloutButton;
