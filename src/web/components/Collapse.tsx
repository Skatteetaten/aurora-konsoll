import * as React from 'react';

import { ActionButton } from '@skatteetaten/frontend-components/ActionButton';

interface ICollapseProps {
  children: JSX.Element;
  isCollapsed?: boolean;
}

interface ICollapseState {
  isCollapsed: boolean;
}

export default class Collapse extends React.Component<
  ICollapseProps,
  ICollapseState
> {
  public state: ICollapseState = {
    isCollapsed: false,
  };

  public componentDidMount() {
    this.setState((state) => ({
      isCollapsed: this.props.isCollapsed || state.isCollapsed,
    }));
  }

  public render() {
    const { isCollapsed } = this.state;
    return (
      <div>
        {this.renderToggleButton()}
        {!isCollapsed && this.props.children}
      </div>
    );
  }

  private renderToggleButton = () => {
    const { isCollapsed } = this.state;
    const iconName = isCollapsed ? 'CircleRight' : 'CircleDown';

    return (
      <ActionButton icon={iconName} onClick={this.toggleCollapse}>
        {isCollapsed ? 'Utvid' : 'Lukk'}
      </ActionButton>
    );
  };

  private toggleCollapse = () => {
    this.setState((state) => ({
      isCollapsed: !state.isCollapsed,
    }));
  };
}
