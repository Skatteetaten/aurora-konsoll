/* tslint:disable:no-console */

import {default as ApolloClient} from 'apollo-boost';
import * as qs from 'qs';
import * as React from 'react';
import {ApolloProvider} from 'react-apollo';
import * as ReactDOM from 'react-dom';
import {BrowserRouter, Redirect, Route, RouteComponentProps} from 'react-router-dom';
import App from './App';
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import TokenStore from './TokenStore'


interface IConfiguration {
  AUTHORIZATION_URI: string;
  CLIENT_ID: string;
  GRAPHQL_URL: string;
}

async function fetchConfiguration(): Promise<IConfiguration | Error> {
  try {
    const data = await fetch('/api/config');
    return await data.json();
  } catch (error) {
    (window as any).e = error;
    return error;
  }
}


const tokenStore = new TokenStore();

function isAuthenticatedOrAcceptingToken(): boolean {

  const isTokenValid = tokenStore.isTokenValid();
  return isTokenValid || window.location.pathname === '/accept-token';
}

function redirectToLoginPage(authorizationUri: string, clientId: string) {

  const authorizationUrl =
    authorizationUri +
    '?' +
    qs.stringify(
      Object.assign({
        client_id: clientId,
        redirect_uri: window.location.origin + '/accept-token',
        response_type: 'token',
        scope: '',
        state: ''
      })
    );
  window.location.replace(authorizationUrl);
}

const AcceptToken = ({location}: RouteComponentProps<{}>) => {
  interface IAuthQueryString {
    expires_in: string
    access_token: string
  }

  const authQueryString = qs.parse(location.hash.substring(1)) as IAuthQueryString;
  const token = authQueryString.access_token;
  const expiresInSeconds = Number(authQueryString.expires_in);
  tokenStore.updateToken(token, expiresInSeconds);

  return <Redirect push={true} to="/" />;
};

class Application extends React.Component<{
  isLoggedIn: boolean
}, {}> {

  public render() {

    return (
      <BrowserRouter>
        <div>
          <Route exact={true} path="/" component={App} />
          <Route exact={true} path="/accept-token" component={AcceptToken} />
        </div>
      </BrowserRouter>
    );
  }
}

async function init() {

  const configOrError = await fetchConfiguration();
  if ((configOrError as Error).message) {
    console.log((configOrError as Error).message);
    return;
  }
  const config = configOrError as IConfiguration;

  const isLoggedIn = isAuthenticatedOrAcceptingToken();
  if (!isLoggedIn) {
    redirectToLoginPage(config.AUTHORIZATION_URI, config.CLIENT_ID);
  }

  const client = new ApolloClient({
    uri: config.GRAPHQL_URL
  });
  /*

    interface IAffiliations {
      affiliations: {
        edges: Array<{
          node: {
            name: string;
          };
        }>;
      };
    }

    client
      .query<IAffiliations>({
        query: gql`
          {
            affiliations {
              edges {
                node {
                  name
                }
              }
            }
          }
        `
      })
      .then(result => {
        const {affiliations} = result.data;
        console.log(
          affiliations.edges.reduce((acc, edge) => [...acc, edge.node.name], [])
        );
      });
  */

  ReactDOM.render(
    <ApolloProvider client={client}>
      <Application isLoggedIn={isLoggedIn} />
    </ApolloProvider>,
    document.getElementById('root') as HTMLElement
  );
  registerServiceWorker();

}

init();