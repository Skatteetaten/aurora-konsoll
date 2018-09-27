import * as React from 'react';

import { Omit } from 'types/utils';

import { AuroraApiContext, IAuroraApiComponentProps } from './AuroraApi';

export function withAuroraApi<P extends IAuroraApiComponentProps>(
  Component: React.ComponentType<P>
): React.ComponentClass<Omit<P, keyof IAuroraApiComponentProps>> {
  return class AuroraApiHOC extends React.Component<P> {
    public render() {
      return (
        <AuroraApiContext.Consumer>
          {({ clients }) => {
            if (!clients) {
              throw new Error(
                'Clients is missing, must be used within AuroraApiProvider'
              );
            }
            const props = { clients };
            return <Component {...this.props} {...props} />;
          }}
        </AuroraApiContext.Consumer>
      );
    }
  };
}
