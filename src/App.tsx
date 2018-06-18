import Button from 'aurora-frontend-react-komponenter/Button';
import Grid from 'aurora-frontend-react-komponenter/Grid';
import * as React from 'react';
import './App.css';

class App extends React.Component {
  public render() {
    return (
      <Grid>
        <Grid.Row>
          <Grid.Col lg={1}>
            <Button type="primary" icon="Done">
              Bekreft
            </Button>
          </Grid.Col>
        </Grid.Row>
      </Grid>
    );
  }
}

export default App;
