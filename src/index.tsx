import * as qs from 'qs';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {
  BrowserRouter,
  Redirect,
  Route,
  RouteComponentProps
} from 'react-router-dom';
import App from './App';
import './index.css';
import registerServiceWorker from './registerServiceWorker';

async function verifyAuthenticated(): Promise<boolean> {
  const token = window.localStorage.getItem('token');
  const expiresAt = window.localStorage.getItem('expiresAt');
  const tokenExpired = new Date().getTime() > Number(expiresAt);
  if (token || !tokenExpired || window.location.pathname === '/accept-token') {
    return true;
  }

  let authorizationUrl: string;
  try {
    const data = await fetch('/api/config');
    const { AUTHORIZATION_URI, CLIENT_ID } = await data.json();

    authorizationUrl =
      AUTHORIZATION_URI +
      '?' +
      qs.stringify(
        Object.assign({
          client_id: CLIENT_ID,
          redirect_uri: window.location.origin + '/accept-token',
          response_type: 'token',
          scope: '',
          state: ''
        })
      );
  } catch (e) {
    /* tslint:disable:no-console */
    // TODO: Handle errors
    console.log('ERROR: ', e);
    return false;
  }

  window.location.replace(authorizationUrl);
  return false;
}

const AcceptToken = ({ location }: RouteComponentProps<{}>) => {
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

verifyAuthenticated().then(isLoggedIn => {
  if (isLoggedIn) {
    ReactDOM.render(<Application />, document.getElementById(
      'root'
    ) as HTMLElement);
    registerServiceWorker();
  }
});
