import * as React from 'react';
import { Omit } from 'react-router';
import { IApplicationDeployment } from 'services/AuroraApiClient/types';

export interface IApplicationDeploymentContext {
  deployments: IApplicationDeployment[];
}

const ApplicationDeploymentContext = React.createContext<
  IApplicationDeploymentContext
>({
  deployments: []
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
          {({ deployments }) => {
            const props = { deployments };
            return <Component {...this.props} {...props} />;
          }}
        </ApplicationDeploymentContext.Consumer>
      );
    }
  };
}

export default withApplicationDeployments;
