import * as React from 'react';
import { IAuroraApiClient } from 'services/AuroraApiClient';

const AuroraApiContext = React.createContext<IAuroraApiContextValues>({
  client: undefined
});

const AuroraApiProvider = ({ client, children }: IAuroraApiProviderProps) => (
  <AuroraApiContext.Provider
    value={{
      client
    }}
  >
    {children}
  </AuroraApiContext.Provider>
);

function AuroraApi<P>({ children, fetch }: IAuroraApiProps<P>) {
  return (
    <AuroraApiContext.Consumer>
      {({ client }) => {
        if (!client) {
          throw new Error(
            'AuroraApiClient is missing. Please use AuroraApiProvider.'
          );
        }
        return (
          <AuroraApiCall fetch={fetch} client={client} children={children} />
        );
      }}
    </AuroraApiContext.Consumer>
  );
}

class AuroraApiCall<P> extends React.Component<
  IAuroraApiCallProps<P>,
  IAuroraApiCallState<P>
> {
  public state = {
    response: undefined
  };

  public async componentDidMount() {
    const response = await this.props.fetch(this.props.client);
    this.setState({
      response
    });
  }

  public render() {
    const { response } = this.state;
    if (!response) {
      return null;
    }
    return this.props.children(response);
  }
}

interface IAuroraApiCallState<P> {
  response?: P;
}

interface IAuroraApiCallProps<P> extends IAuroraApiProps<P> {
  client: IAuroraApiClient;
}

interface IAuroraApiProps<P> {
  fetch: (client: IAuroraApiClient) => Promise<P>;
  children: (data: P) => React.ReactNode;
}

interface IAuroraApiProviderProps {
  client: IAuroraApiClient;
  children: React.ReactNode;
}

interface IAuroraApiContextValues {
  client?: IAuroraApiClient;
}

export { AuroraApiProvider, AuroraApi };
