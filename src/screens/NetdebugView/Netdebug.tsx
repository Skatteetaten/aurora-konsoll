import * as React from 'react';
import styled from 'styled-components';

import Button from 'aurora-frontend-react-komponenter/Button';
import Grid from 'aurora-frontend-react-komponenter/Grid';
import Spinner from 'aurora-frontend-react-komponenter/Spinner';
import TextField from 'aurora-frontend-react-komponenter/TextField';

import CardInfo from './CardInfo';
import NetdebugDataFromScan, { INetdebugResult } from './ResponseDataParsed';
import Table from './Table';

const StyledButton = styled.div`
  margin: 24px 0px 23px;
`;

const hostnameValidator = /(^|\s)((https?:\/\/)?[\w-]+(\.[\w-]+)+\.?(:\d+)?(\/\S*)?)/gi;
const portValidator = /^(6553[0-5]|655[0-2]\d|65[0-4]\d\d|6[0-4]\d{3}|[1-5]\d{4}|[1-9]\d{0,3}|0)$/gi;

interface INetdebugState {
  hostnameValue: string;
  isLoading: boolean;
  portValue: string;
  lastScan: string;
  showCard: boolean;
  showTable: boolean;
  parsedData: INetdebugResult[];
  validateErrors: {
    hostname: boolean;
    port: boolean;
  };
}

class Netdebug extends React.Component<{}, INetdebugState> {
  public state: INetdebugState = {
    hostnameValue: '',
    isLoading: false,
    lastScan: '',
    parsedData: NetdebugDataFromScan,
    portValue: '',
    showCard: false,
    showTable: false,
    validateErrors: {
      hostname: false,
      port: false
    }
  };

  public handleUserInput = () => {
    this.setState(() => ({
      isLoading: true
    }));

    // Simuler nettverkskall
    setTimeout(() => {
      this.setState(state => ({
        isLoading: false,
        lastScan: `${state.hostnameValue}:${state.portValue}`,
        showCard: true
        // parsedData: (hentet data)
      }));
    }, 1000);
  };

  public displayTableOnClicked = () => {
    this.setState(prevState => ({ showTable: !prevState.showTable }));
  };

  public handleHostnameValue = (hostname: string) => {
    this.setState({
      hostnameValue: hostname
    });
  };

  public handlePortValue = (port: string) => {
    this.setState(state => ({
      portValue: port,
      validateErrors: {
        ...state.validateErrors,
        port: !!port && !port.match(portValidator)
      }
    }));
  };

  public validateHostname = () => {
    this.setState(state => ({
      validateErrors: {
        ...state.validateErrors,
        hostname:
          !!state.hostnameValue && !state.hostnameValue.match(hostnameValidator)
      }
    }));
  };

  public render() {
    const { validateErrors, hostnameValue, portValue } = this.state;
    const canScan =
      !validateErrors.hostname &&
      hostnameValue &&
      !validateErrors.port &&
      portValue;

    let hostnameError = '';
    if (validateErrors.hostname) {
      hostnameError = 'Hostname ikke gyldig';
    }

    let portError = '';
    if (validateErrors.port) {
      portError = 'Port ikke gyldig';
    }

    return (
      <Grid>
        <Grid.Row>
          <Grid.Col lg={12}>
            <h1>Nettverksdebug</h1>
            <p>Et verktøy for å sjekke om brannvegger er åpne på et cluster.</p>
          </Grid.Col>
        </Grid.Row>
        <Grid.Row>
          <Grid.Col lg={4} xl={3} xxl={2}>
            <TextField
              name="hostName"
              label="Hostname"
              onBlur={this.validateHostname}
              onChanged={this.handleHostnameValue}
              errorMessage={hostnameError}
            />
          </Grid.Col>
          <Grid.Col lg={4} xl={3} xxl={2}>
            <TextField
              name="portName"
              label="Port"
              onChanged={this.handlePortValue}
              errorMessage={portError}
            />
          </Grid.Col>
          <Grid.Col lg={2} xl={1} xxl={1}>
            <StyledButton>
              <Button
                buttonType="primary"
                onClick={this.handleUserInput}
                disabled={!canScan}
              >
                {this.state.isLoading ? <Spinner /> : 'Scan'}
              </Button>
            </StyledButton>
          </Grid.Col>
        </Grid.Row>

        {this.state.showCard && (
          <Grid.Row>
            <Grid.Col lg={6}>
              <CardInfo
                netdebugStatus={'OPEN'} // for testing forløpig, status vil komme fra backend når det er implemenetert
                lastScan={this.state.lastScan}
                displayTableOnClicked={this.displayTableOnClicked}
              />
            </Grid.Col>
          </Grid.Row>
        )}
        {this.state.showTable && (
          <Grid.Row>
            <Grid.Col lg={11}>
              <Table parsedData={this.state.parsedData} />
            </Grid.Col>
          </Grid.Row>
        )}
      </Grid>
    );
  }
}

export default Netdebug;
