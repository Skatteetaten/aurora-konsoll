import * as React from 'react';
import styled from 'styled-components';

import Button from 'aurora-frontend-react-komponenter/Button';
import Spinner from 'aurora-frontend-react-komponenter/Spinner';
import TextField from 'aurora-frontend-react-komponenter/TextField';

import CardInfo from './CardInfo';
import Table from './Table';

import { INetdebugResult } from 'services/auroraApiClients';

import { IAuroraApiComponentProps, withAuroraApi } from 'components/AuroraApi';

const hostnameValidator = /(^|\s)([\w-]+(\.[\w-]+)+\.?(:\d+)?(\/\S*)?)/gi;
const portValidator = /^(6553[0-5]|655[0-2]\d|65[0-4]\d\d|6[0-4]\d{3}|[1-5]\d{4}|[1-9]\d{0,3}|0)$/gi;

interface INetdebugState {
  hostnameValue: string;
  isLoading: boolean;
  lastScan: string;
  netdebugStatus: string;
  portValue: string;
  resolvedIp: string;
  showCard: boolean;
  showTable: boolean;
  parsedData?: INetdebugResult;
  validateErrors: {
    hostname: boolean;
    port: boolean;
  };
}

interface INetdebugProps extends IAuroraApiComponentProps {
  className?: string;
}

class Netdebug extends React.Component<INetdebugProps, INetdebugState> {
  public state: INetdebugState = {
    hostnameValue: '',
    isLoading: false,
    lastScan: '',
    netdebugStatus: '',
    portValue: '',
    resolvedIp: '',
    showCard: false,
    showTable: false,
    validateErrors: {
      hostname: false,
      port: false
    }
  };

  public async scanCall() {
    const scanResult = await this.props.clients.netdebugClient.findNetdebugStatus(
      this.state.hostnameValue,
      this.state.portValue
    );
    this.setState(state => ({
      isLoading: false,
      lastScan: `${state.hostnameValue}:${state.portValue}`,
      netdebugStatus: scanResult.status,
      parsedData: scanResult,
      showCard: true
    }));
  }

  public onScanClicked = () => {
    this.setState(() => ({
      isLoading: true
    }));
    this.scanCall();
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
    const { className } = this.props;
    const canScan =
      !validateErrors.hostname &&
      hostnameValue &&
      !validateErrors.port &&
      portValue;

    let hostnameError = '';
    if (validateErrors.hostname) {
      hostnameError = 'Hostname er ikke gyldig';
    }

    let portError = '';
    if (validateErrors.port) {
      portError = 'Port er ikke gyldig';
    }

    return (
      <div className={className}>
        <div className="body-wrapper">
          <h1>Nettverksdebug</h1>
          <p>Et verktøy for å sjekke om brannvegger er åpne på et cluster.</p>
          <div className="netdebug-grid">
            <div className="container-wrapper">
              <div className="input-wrapper">
                <TextField
                  name="hostName"
                  label="Hostname"
                  onBlur={this.validateHostname}
                  onChanged={this.handleHostnameValue}
                  errorMessage={hostnameError}
                />
              </div>
              <div className="input-wrapper">
                <TextField
                  name="portName"
                  label="Port"
                  onChanged={this.handlePortValue}
                  errorMessage={portError}
                />
              </div>
              <Button
                style={{ minWidth: '100px' }}
                buttonType="primary"
                onClick={this.onScanClicked}
                disabled={!canScan}
              >
                {this.state.isLoading ? <Spinner /> : 'Scan'}
              </Button>
            </div>
            <div className="card-wrapper">
              {this.state.showCard &&
                this.state.parsedData && (
                  <CardInfo
                    parsedData={this.state.parsedData}
                    netdebugStatus={this.state.netdebugStatus}
                    lastScan={this.state.lastScan}
                    displayTableOnClicked={this.displayTableOnClicked}
                  />
                )}
            </div>
          </div>
          <div className="table-wrapper">
            {this.state.showTable &&
              this.state.parsedData && (
                <Table parsedData={this.state.parsedData} />
              )}
          </div>
        </div>
      </div>
    );
  }
}

const StyledNetdebug = styled(Netdebug)`
  max-height: 100%;
  overflow-x: auto;

  .body-wrapper {
    padding: 0 10px;
  }

  .netdebug-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-areas:
      'content .'
      'card .';
  }
  .container-wrapper {
    grid-area: content;
    display: flex;
    align-items: center;
    min-width: 500px;
  }
  .input-wrapper {
    flex: 1;
    margin-right: 12px;
    height: 82px;
  }
  .card-wrapper {
    margin: 10px 0 0 0;
    grid-area: card;
  }
  .table-wrapper {
    margin: 20px 10px 0 0;
  }
`;

export const NetdebugWithApi = withAuroraApi(StyledNetdebug);

export default StyledNetdebug;
