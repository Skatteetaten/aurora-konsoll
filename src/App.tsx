import FooterContent from 'aurora-frontend-react-komponenter/FooterContent';
import Grid from 'aurora-frontend-react-komponenter/Grid';
import Header from 'aurora-frontend-react-komponenter/Layout/Header';
import SkeBasis from 'aurora-frontend-react-komponenter/SkeBasis';
import * as React from 'react';
import './App.css';

import logo from './logo.svg';

class App extends React.Component {
  public render() {
    return (
      <SkeBasis>

        <div className="App">
          <Header />
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <h1 className="App-title">Welcome to React</h1>
          </header>
          <p className="App-intro">
            To get started, edit <code>src/App.tsx</code> and save to reload.
          </p>
        </div>
        <FooterContent>
          <Grid>
            <Grid.Row>
              <Grid.Col sm={12} lg={12} xl={3}>
                <FooterContent.Logo />
              </Grid.Col>
              <Grid.Col sm={12} lg={12} xl={3}>
                Annet innhold
              </Grid.Col>
            </Grid.Row>
          </Grid>
        </FooterContent>
      </SkeBasis>
    );
  }
}

export default App;
