import * as React from 'react';
import styled from 'styled-components';

import ActionButton from 'aurora-frontend-react-komponenter/ActionButton';
import Grid from 'aurora-frontend-react-komponenter/Grid';
import Spinner from 'aurora-frontend-react-komponenter/Spinner';
import TextField from 'aurora-frontend-react-komponenter/TextField';

import CardInfo from './CardInfo';
import NetdebugDataFromScan, { INetdebugResult } from './ResponseDataParsed';
import Table from './Table';

const MinimumWindowSize = styled.div`
  min-width: 1500px;
  min-height: 1500px;
`;

const MarginSpinner = styled.div`
  margin: 30px 170px 0px -10px;
`;

const MarginTopButton = styled.div`
  margin: 22px 0 -10px -10px;
`;

const AddSpace = styled.div`
  vertical-align: top;
  height: 70px;
`;

interface INetdebugState {
  error: string;
  hostnameValue: string;
  isLoading: boolean;
  portValue: string;
  showCard: boolean;
  showTable: boolean;
  parsedData: INetdebugResult[];
}

class Netdebug extends React.Component<{}, INetdebugState> {
  public state = {
    error: '',
    hostnameValue: '',
    isLoading: false,
    parsedData: NetdebugDataFromScan,
    portValue: '',
    showCard: false,
    showTable: false
  };

  public setErrorIfNaN = (data: any) => {
    if (isNaN(data)) {
      this.setState({ error: 'Kun tall' });
    } else {
      this.setState({ error: '' });
    }
  };

  public handleUserInput = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.persist();
    const hostName = e.currentTarget.elements.namedItem(
      'hostName'
    ) as HTMLInputElement;
    const portName = e.currentTarget.elements.namedItem(
      'portName'
    ) as HTMLInputElement;
    this.setState(() => ({
      hostnameValue: hostName.value,
      isLoading: true,
      portValue: portName.value
    }));

    // Simuler nettverkskall
    setTimeout(() => {
      this.setState({
        isLoading: false,
        showCard: true
        // parsedData: (hentet data)
      });
    }, 1000);
  };

  public displayTableOnClicked = () => {
    this.setState(prevState => ({ showTable: !prevState.showTable }));
  };

  public render() {
    return (
      <MinimumWindowSize>
        <Grid>
          <Grid.Row>
            <Grid.Col lg={12}>
              <h1>Nettverksdebug</h1>
              <p>
                Et verktøy for å sjekke om brannvegger er åpne på et cluster.
              </p>
            </Grid.Col>
          </Grid.Row>
          <AddSpace>
            <Grid.Row>
              <form onSubmit={this.handleUserInput}>
                <Grid.Col lg={2}>
                  <TextField name={'hostName'} label={'Hostname'} />
                </Grid.Col>
                <Grid.Col lg={2}>
                  <TextField
                    name={'portName'}
                    label={'Port'}
                    onChanged={this.setErrorIfNaN}
                    errorMessage={this.state.error}
                  />
                </Grid.Col>
                <Grid.Col lg={2}>
                  {this.state.isLoading ? (
                    <MarginSpinner>
                      <Spinner />
                    </MarginSpinner>
                  ) : (
                    <MarginTopButton>
                      <ActionButton
                        type="submit"
                        id={'scanID'}
                        buttonType={'primary'}
                      >
                        Scan
                      </ActionButton>
                    </MarginTopButton>
                  )}
                </Grid.Col>
              </form>
            </Grid.Row>
          </AddSpace>
          <Grid.Row rowSpacing={Grid.SPACE_MEDIUM} />
          <CardInfo
            showCard={this.state.showCard}
            netdebugStatus={'OPEN'} // for testing forløpig, status vil komme fra backend når det er implemenetert
            hostnameValue={this.state.hostnameValue}
            portValue={this.state.portValue}
            displayTableOnClicked={this.displayTableOnClicked}
          />
          <Table
            showTable={this.state.showTable}
            parsedData={this.state.parsedData}
          />
        </Grid>
      </MinimumWindowSize>
    );
  }
}

export default Netdebug;
