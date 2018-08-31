import * as React from 'react';
import styled from 'styled-components';

import Icon from 'aurora-frontend-react-komponenter/Icon';

interface IInfoStripeProps {
  name: string;
  className?: string;
  children?: React.ReactNode;
}

interface IInfoStripeState {
  expanded: boolean;
}

class InfoStripe extends React.Component<IInfoStripeProps, IInfoStripeState> {
  public state: IInfoStripeState = {
    expanded: true
  };

  public getIconClass = () =>
    this.state.expanded ? 'ChevronDown' : 'ChevronRight';

  public expand = () => {
    this.setState({ expanded: !this.state.expanded });
  };

  public render() {
    const { name, className, children } = this.props;

    return (
      <div className={className}>
        <div className="info-stripe" onClick={this.expand}>
          <span className="info-stripe-name">
            <Icon iconName={this.getIconClass()} />
            {name}
          </span>
        </div>
        {this.state.expanded ? (
          <div className="info-stripe-content">
            {children ? children : <p>Ingen data</p>}
          </div>
        ) : null}
      </div>
    );
  }
}

export default styled(InfoStripe)`
  position: relative;
  margin: 10px 0;

  .info-stripe {
    position: relative;
    padding: 5px 0;
    border: 1px solid grey;
    cursor: pointer;

    i {
      position: relative;
      top: 8px;
      margin-right: 5px;
      font-size: 28px;
      color: #999;
    }
  }
  span.info-stripe-name {
    position: relative;
    margin-left: 5px;
    bottom: 5px;
    font-size: 18px;
    user-select: none;
  }

  .info-stripe-content {
    display: flex;
    flex-direction: column;
    padding: 5px 10px 5px 10px;
    border-left: 1px solid grey;
    border-right: 1px solid grey;
    border-bottom: 1px solid grey;

    p {
      margin: 0;
    }
  }
`;
