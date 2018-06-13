/* tslint:disable:no-console */

import {default as ApolloClient} from 'apollo-boost';
import {default as gql} from 'graphql-tag';
import * as qs from 'qs';
import * as React from 'react';
import {ApolloProvider} from 'react-apollo';
import * as ReactDOM from 'react-dom';
import {BrowserRouter, Redirect, Route, RouteComponentProps} from 'react-router-dom';
import App from './App';
import './index.css';
import registerServiceWorker from './registerServiceWorker';


interface IConfiguration {
  AUTHORIZATION_URI: string;
  CLIENT_ID: string;
  GRAPHQL_URL: string;
}

async function fetchConfiguration(): Promise<IConfiguration | Error> {
  try {
    const data = await fetch('/api/config1');
    return await data.json();
  } catch (error) {
    (window as any).e = error;
    return error;
  }
}

function verifyAuthenticated(
  authorizationUri: string,
  clientId: string
): boolean {
  const token = window.localStorage.getItem('token');
  const expiresAt = window.localStorage.getItem('expiresAt');
  const tokenExpired = new Date().getTime() > Number(expiresAt);
  if (token || !tokenExpired || window.location.pathname === '/accept-token') {
    return true;
  }
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
  return false;
}

const AcceptToken = ({location}: RouteComponentProps<{}>) => {
  const data = qs.parse(location.hash.substring(1));
  const time = new Date().getTime();
  const expiresIn = Number(data.expires_in) * 1000;
  const expiresAt = new Date(time + expiresIn).getTime();

  window.localStorage.setItem('token', data.access_token);
  window.localStorage.setItem('expiresAt', expiresAt.toString());
  return <Redirect push={true} to="/" />;
};

interface IApplicationState {
  loggedIn: boolean;
}

class Application extends React.Component<{}, IApplicationState> {
  public state = {
    loggedIn: false
  };

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

  const isLoggedIn = await verifyAuthenticated(config.AUTHORIZATION_URI, config.CLIENT_ID);
  if (!isLoggedIn) {
    return;
  }

  const client = new ApolloClient({
    uri: config.GRAPHQL_URL
  });

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

  ReactDOM.render(
    <ApolloProvider client={client}>
      <Application />
    </ApolloProvider>,
    document.getElementById('root') as HTMLElement
  );
  registerServiceWorker();

}

init();