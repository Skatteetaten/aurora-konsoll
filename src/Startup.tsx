import * as React from 'react';

import { connect } from 'react-redux';

import { getCurrentUser } from './state/actions';

interface IStartupProps {
  onFetchCurrentUser: () => void;
}

class Startup extends React.Component<IStartupProps, {}> {
  public componentDidMount() {
    const { onFetchCurrentUser } = this.props;
    onFetchCurrentUser();
  }
  public render() {
    return this.props.children;
  }
}

export const StartupConnected = connect(
  null,
  {
    onFetchCurrentUser: () => getCurrentUser()
  }
)(Startup);
