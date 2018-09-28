import * as React from 'react';

import { IApplicationDeployment } from 'models/ApplicationDeployment';
import { Omit } from 'types/utils';

export interface IApplicationDeploymentContext {
  deployments: IApplicationDeployment[];
  fetchApplicationDeployments: () => void;
  buildDeploymentLink: (
    deployment: IApplicationDeployment
  ) => React.ComponentType;
}

const ApplicationDeploymentContext = React.createContext<
  IApplicationDeploymentContext
>({
  buildDeploymentLink: (_: IApplicationDeployment) => () => <div />,
  deployments: [],
  fetchApplicationDeployments: () => {
    return;
  }
});

export const ApplicationDeploymentProvider =
  ApplicationDeploymentContext.Provider;

export function withApplicationDeployments<
  P extends IApplicationDeploymentContext
>(
  Component: React.ComponentType<P>
): React.ComponentClass<Omit<P, keyof IApplicationDeploymentContext>> {
  return class extends React.Component<P> {
    public render() {
      return (
        <ApplicationDeploymentContext.Consumer>
          {props => {
            return <Component {...this.props} {...props} />;
          }}
        </ApplicationDeploymentContext.Consumer>
      );
    }
  };
}

export default withApplicationDeployments;
