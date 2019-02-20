import * as React from 'react';

export interface IStartupProps {
  onFetchCurrentUser: () => void;
}

export default class Startup extends React.Component<IStartupProps, {}> {
  public componentDidMount() {
    const { onFetchCurrentUser } = this.props;
    onFetchCurrentUser();
  }
  public render() {
    return this.props.children;
  }
}
