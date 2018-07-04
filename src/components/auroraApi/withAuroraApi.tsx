import * as React from 'react';

import { AuroraApiContext, IAuroraApiContext } from 'components/AuroraApi';

function withAuroraApi<P>(
  Component: React.ComponentType<P & IAuroraApiContext>
) {
  return class extends React.Component {
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
            return <Component {...props} />;
          }}
        </AuroraApiContext.Consumer>
      );
    }
  };
}

export default withAuroraApi;
