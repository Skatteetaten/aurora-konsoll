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

const AcceptToken = ({ location }: RouteComponentProps<{}>) => {
  const data = qs.parse(location.hash.substring(1));
  window.localStorage.setItem('token', data.access_token);
  return <Redirect push={true} to="/" />;
};

interface IApplicationState {
  loggedIn: boolean;
}

class Application extends React.Component<{}, IApplicationState> {
  public state = {
    loggedIn: false
  };

  public componentDidMount() {
    const token = window.localStorage.getItem('token');
    if (!token && window.location.pathname !== '/accept-token') {
      window.location.replace('/api/start-login');
    }
  }

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

ReactDOM.render(<Application />, document.getElementById(
  'root'
) as HTMLElement);
registerServiceWorker();
