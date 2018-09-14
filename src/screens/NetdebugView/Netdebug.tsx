import * as React from 'react';

import ActionButton from 'aurora-frontend-react-komponenter/ActionButton';
import Card from 'aurora-frontend-react-komponenter/Card';
import DetailsList from 'aurora-frontend-react-komponenter/DetailsList';
import Grid from 'aurora-frontend-react-komponenter/Grid';
import Spinner from 'aurora-frontend-react-komponenter/Spinner';
import TextField from 'aurora-frontend-react-komponenter/TextField';
import './Netdebug.css';
import parsedData from './ResponseDataParsed';

const columns = [
  {
    fieldName: 'status',
    isResizable: true,
    key: 'column1',
    maxWidth: 100,
    minWidth: 50,
    name: 'Status'
  },
  {
    fieldName: 'resolvedIP',
    isResizable: true,
    key: 'column3',
    maxWidth: 150,
    minWidth: 50,
    name: 'Resolved IP'
  },
  {
    fieldName: 'message',
    isResizable: true,
    key: 'column5',
    maxWidth: 500,
    minWidth: 100,
    name: 'Message'
  },
  {
    fieldName: 'hostIp',
    isResizable: true,
    key: 'column6',
    maxWidth: 250,
    minWidth: 100,
    name: 'IP til noden som gjør sjekk'
  },
  {
    fieldName: 'podIp',
    isResizable: true,
    key: 'column7',
    maxWidth: 250,
    minWidth: 100,
    name: 'IP til poden som gjør sjekk'
  }
];

interface INetdebugProps {
  allOpenPortsMessage: string;
  statusColorGreen: string;
  statusColorRed: string;
}

interface INetdebugStates {
  error: string;
  portValue: string;
  isLoading: boolean;
  showTable: boolean;
  hostnameValue: string;
  netdebugStatus: string;
  netdebugStatusFlag: boolean;
  netdebugStatusList: {
    indicatorColor: string;
    textInfo: string;
    debugMessage: string;
  };
}

class Netdebug extends React.Component<INetdebugProps, INetdebugStates> {
  public static defaultProps: INetdebugProps;
  constructor(props: INetdebugProps) {
    super(props);
    this.state = {
      error: '',
      hostnameValue: '',
      isLoading: false,
      netdebugStatus: '',
      netdebugStatusFlag: false,
      netdebugStatusList: {
        debugMessage: '',
        indicatorColor: '',
        textInfo: ''
      },
      portValue: '',
      showTable: false
    };
  }

  public setError = (data: any) => {
    if (isNaN(data)) {
      this.setState({ error: 'Kun tall' });
    } else {
      this.setState({ error: '' });
    }
  };

  public renderButton = () => {
    if (this.state.showTable) {
      this.setState(() => ({ isLoading: !this.state.isLoading }));
    }
  };

  public tableShow = () => {
    this.setState(() => ({ showTable: !this.state.showTable }));
  };

  public renderNetdebugStatus = () => {
    if (this.state.netdebugStatus === 'allOpen') {
      this.setState(() => ({
        netdebugStatusFlag: true,
        netdebugStatusList: {
          debugMessage: this.props.allOpenPortsMessage,
          indicatorColor: this.props.statusColorGreen,
          textInfo: 'OPEN'
        }
      }));
    } else if (this.state.netdebugStatus === 'dnsFail') {
      this.setState(() => ({
        netdebugStatusFlag: true,
        netdebugStatusList: {
          debugMessage: '',
          indicatorColor: this.props.statusColorRed,
          textInfo: 'DNS_FAILED'
        }
      }));
    } else {
      this.setState(() => ({
        netdebugStatusFlag: true,
        netdebugStatusList: {
          debugMessage: '',
          indicatorColor: this.props.statusColorRed,
          textInfo: 'UNKOWN'
        }
      }));
    }
  };

  public handleInput = (e: React.FormEvent<HTMLFormElement>) => {
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
      portValue: portName.value
    }));
    this.renderButton();
  };

  public render() {
    return (
      <Grid>
        <Grid.Row>
          <Grid.Col lg={12}>
            <h1>Nettverksdebug</h1>
            <p>Et verktøy for å sjekke om brannvegger er åpne på et cluster.</p>
          </Grid.Col>
        </Grid.Row>
        <div className="add-space">
          <Grid.Row>
            <form onSubmit={this.handleInput}>
              <Grid.Col lg={2}>
                <TextField name={'hostName'} label={'Hostname'} />
              </Grid.Col>
              <Grid.Col lg={2}>
                <TextField
                  name={'portName'}
                  label={'Port'}
                  onChanged={this.setError}
                  errorMessage={this.state.error}
                />
              </Grid.Col>
              <Grid.Col lg={2}>
                {this.state.isLoading ? (
                  <div className="marginSpinner">
                    <Spinner />
                  </div>
                ) : (
                  <div className="marginTopButton">
                    <ActionButton
                      type="submit"
                      id={'scanID'}
                      buttonType={'primary'}
                      onClick={this.renderNetdebugStatus}
                    >
                      Scan
                    </ActionButton>
                  </div>
                )}
              </Grid.Col>
            </form>
          </Grid.Row>
        </div>
        <Grid.Row rowSpacing={Grid.SPACE_LARGE} />
        <Grid.Row>
          <Grid.Col lg={6}>
            {this.state.netdebugStatusFlag && (
              <Card>
                <Grid>
                  <Grid.Row>
                    <div
                      className={this.state.netdebugStatusList.indicatorColor}
                    />
                    <div className="centering">
                      <h1 className="collapse">
                        {this.state.netdebugStatusList.textInfo}
                      </h1>
                    </div>
                  </Grid.Row>
                  <Grid.Row>
                    <div className="centering">
                      <h3 className="color-port-hostname">
                        {this.state.hostnameValue}:{this.state.portValue}
                      </h3>
                      <div className="collapse">
                        <p>
                          {this.state.netdebugStatusList.debugMessage} Klikk{' '}
                          <a onClick={this.tableShow}>her</a> for mer
                          informasjon.
                        </p>
                      </div>
                    </div>
                  </Grid.Row>
                </Grid>
              </Card>
            )}
          </Grid.Col>
        </Grid.Row>
        {this.state.showTable && (
          <Grid.Row>
            <Grid.Col lg={11}>
              <DetailsList columns={columns} items={parsedData} />
            </Grid.Col>
          </Grid.Row>
        )}
      </Grid>
    );
  }
}

Netdebug.defaultProps = {
  allOpenPortsMessage: 'Kan nåes fra alle noder. ',
  statusColorGreen: 'indicator-green',
  statusColorRed: 'indicator-red'
};

export default Netdebug;
