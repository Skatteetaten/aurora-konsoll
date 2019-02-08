import * as React from 'react';

import Icon from 'aurora-frontend-react-komponenter/Icon';
import TextField from 'aurora-frontend-react-komponenter/TextField';
import palette from 'aurora-frontend-react-komponenter/utils/palette';
import LoadingButton from 'components/LoadingButton';
import { IJdbcUser } from 'models/schemas';
import styled from 'styled-components';

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
  onTestJdbcConnectionForId?: (id: string) => void;
  onTestJdbcConnectionForUser?: (jdbcUser: IJdbcUser) => void;
  testJdbcConnectionResponse: boolean;
  disabled: boolean;
  className?: string;
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
    const {
      onTestJdbcConnectionForId,
      onTestJdbcConnectionForUser,
      id,
      jdbcUrl,
      password,
      username
    } = this.props;
    const handleJdbcLoading = () => {
      this.setState({
        jdcbTestState: JdcbTestState.RESPONSE
      });
    };
    if (id) {
      this.setState({
        jdcbTestState: JdcbTestState.LOADING
      });
      if (onTestJdbcConnectionForId) {
        await onTestJdbcConnectionForId(id);
      } else {
        if (onTestJdbcConnectionForUser && password && jdbcUrl && username) {
          await onTestJdbcConnectionForUser({
            password,
            jdbcUrl,
            username
          });
        }
      }
      handleJdbcLoading();
    }
  };

  public render() {
    const {
      testJdbcConnectionResponse,
      username,
      jdbcUrl,
      disabled,
      className
    } = this.props;
    const { jdcbTestState } = this.state;

    const displayLoadingOrNotStarted = () =>
      jdcbTestState === JdcbTestState.LOADING ||
      jdcbTestState === JdcbTestState.NOT_STARTED;

    const displaySuccess = () =>
      !displayLoadingOrNotStarted() && testJdbcConnectionResponse;

    const displayFailure = () =>
      !displayLoadingOrNotStarted() && !testJdbcConnectionResponse;

    return (
      <div className={className}>
        <h3>Tilkoblingsinformasjon</h3>
        <TextField
          id={'username'}
          label={'Brukernavn'}
          value={username}
          disabled={disabled}
        />
        <TextField
          id={'jdbcUrl'}
          label={'JDBC url'}
          value={jdbcUrl}
          disabled={disabled}
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
      </div>
    );
  }
}

export default styled(JdbcConnection)`
  .bold {
    font-weight: bold;
  }
  .ms-TextField-wrapper {
    padding-bottom: 10px;
  }

  .styled-jdbc-status {
    margin-left: 7px;
  }

  .styled-jdbc {
    padding-top: 10px;
  }

  .styled-jdbc-wrapper {
    display: flex;
    align-items: center;
    height: 30px;
  }
`;
