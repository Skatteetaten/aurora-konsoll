import * as React from 'react';
import { WebsealConnected } from './WebsealConnected';

export interface IWebsealViewControllerProps {
  affiliation: string;
}

class WebsealViewController extends React.Component<
  IWebsealViewControllerProps,
  {}
> {
  public render() {
    const { affiliation } = this.props;
    return <WebsealConnected affiliation={affiliation} />;
  }
}

export default WebsealViewController;
