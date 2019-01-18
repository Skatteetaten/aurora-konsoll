import * as React from 'react';

import { SchemaConnected } from './schemaConnected';

export interface IDatabaseViewControllerProps {
  affiliation: string;
}

export default class DatabaseViewController extends React.Component<
  IDatabaseViewControllerProps,
  {}
> {
  public render() {
    const { affiliation } = this.props;
    return <SchemaConnected affiliation={affiliation} />;
  }
}
