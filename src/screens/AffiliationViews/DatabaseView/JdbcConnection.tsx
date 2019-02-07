import * as React from 'react';

import Icon from 'aurora-frontend-react-komponenter/Icon';
import TextField from 'aurora-frontend-react-komponenter/TextField';
import palette from 'aurora-frontend-react-komponenter/utils/palette';
import LoadingButton from 'components/LoadingButton';

const { skeColor } = palette;

enum JdcbTestState {
  NOT_STARTED,
  LOADING,
  RESPONSE
}

export interface IJdbcConnectionProps {
  username?: string;
  jdbcUrl?: string;
  id?: string;
  password?: string;
  onTestJdbcConnectionForId: (id: string) => void;
  testJdbcConnectionResponse: boolean;
}

export interface IJdbcConnectionState {
  jdcbTestState: JdcbTestState;
}

class JdbcConnection extends React.Component<
  IJdbcConnectionProps,
  IJdbcConnectionState
> {
  public state = {
    jdcbTestState: JdcbTestState.NOT_STARTED
  };

  public handleTestJdbcConnection = async () => {
    const { onTestJdbcConnectionForId, id } = this.props;
    const handleJdbcLoading = () => {
      this.setState({
        jdcbTestState: JdcbTestState.RESPONSE
      });
    };
    if (id) {
      this.setState({
        jdcbTestState: JdcbTestState.LOADING
      });
      await onTestJdbcConnectionForId(id);
      handleJdbcLoading();
    }
  };

  public render() {
    const { username, jdbcUrl, testJdbcConnectionResponse } = this.props;
    const { jdcbTestState } = this.state;

    const displayLoadingOrNotStarted = () =>
      jdcbTestState === JdcbTestState.LOADING ||
      jdcbTestState === JdcbTestState.NOT_STARTED;

    const displaySuccess = () =>
      !displayLoadingOrNotStarted() && testJdbcConnectionResponse;

    const displayFailure = () =>
      !displayLoadingOrNotStarted() && !testJdbcConnectionResponse;

    return (
      <>
        <h3>Tilkoblingsinformasjon</h3>
        <TextField
          id={'username'}
          label={'Brukernavn'}
          value={username}
          disabled={true}
        />
        <TextField
          id={'jdbcUrl'}
          label={'JDBC url'}
          value={jdbcUrl}
          disabled={true}
        />
        <div className="styled-jdbc">
          <LoadingButton
            onClick={this.handleTestJdbcConnection}
            buttonType="primary"
            style={{ width: '100%' }}
            loading={jdcbTestState === JdcbTestState.LOADING}
          >
            TEST JDBC TILKOBLING
          </LoadingButton>
        </div>
        <p className="styled-jdbc-wrapper">
          Gyldig JDBC tilkobling:
          {displayLoadingOrNotStarted() && (
            <span className="bold styled-jdbc-status">ikke testet</span>
          )}
          {displaySuccess() && (
            <Icon
              className="styled-jdbc-status"
              iconName="Check"
              style={{ color: skeColor.green, fontSize: '30px' }}
            />
          )}
          {displayFailure() && (
            <Icon
              className="styled-jdbc-status"
              iconName="Clear"
              style={{
                color: skeColor.pink,
                fontSize: '30px'
              }}
            />
          )}
        </p>
      </>
    );
  }
}

export default JdbcConnection;
