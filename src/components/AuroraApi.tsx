import * as React from 'react';
import { IAuroraApiClient } from 'services/AuroraApiClient';

interface IApiClients {
  apiClient: IAuroraApiClient;
}

// AuroraApiContext

interface IAuroraApiContextValues {
  clients?: IApiClients;
}

const AuroraApiContext = React.createContext<IAuroraApiContextValues>({
  clients: undefined
});

// AuroraApiProvider

interface IAuroraApiProviderProps {
  clients: IApiClients;
  children: React.ReactNode;
}

const AuroraApiProvider = ({ clients, children }: IAuroraApiProviderProps) => (
  <AuroraApiContext.Provider
    value={{
      clients
    }}
  >
    {children}
  </AuroraApiContext.Provider>
);

// AuroraApi

interface IAuroraApiProps<P> {
  fetch: (clients: IApiClients) => Promise<P>;
  children: (data: P | undefined, loading: boolean) => React.ReactNode;
}

function AuroraApi<P>({ children, fetch }: IAuroraApiProps<P>) {
  return (
    <AuroraApiContext.Consumer>
      {({ clients }) => {
        if (!clients) {
          return null;
        }
        return (
          <AuroraApiCall fetch={fetch} clients={clients} children={children} />
        );
      }}
    </AuroraApiContext.Consumer>
  );
}

// AuroraApiCall

interface IAuroraApiCallState<P> {
  loading: boolean;
  response?: P;
}

interface IAuroraApiCallProps<P> extends IAuroraApiProps<P> {
  clients: IApiClients;
}

class AuroraApiCall<P> extends React.Component<
  IAuroraApiCallProps<P>,
  IAuroraApiCallState<P>
> {
  public state: IAuroraApiCallState<P> = {
    loading: false,
    response: undefined
  };

  public async fetchData() {
    this.setState(() => ({
      loading: true
    }));
    const response = await this.props.fetch(this.props.clients);
    this.setState({
      loading: false,
      response
    });
  }

  public componentDidMount() {
    this.fetchData();
  }

  public componentDidUpdate(prevProps: IAuroraApiCallProps<P>) {
    if (this.props.fetch !== prevProps.fetch) {
      this.fetchData();
    }
  }

  public render() {
    const { response, loading } = this.state;
    return this.props.children(response, loading);
  }
}

export { AuroraApiProvider, AuroraApi, IApiClients };
