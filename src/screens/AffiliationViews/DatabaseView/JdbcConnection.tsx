import * as React from 'react';

import { Icon, TextField, Palette } from '@skatteetaten/frontend-components';
import LoadingButton from 'components/LoadingButton';
import { IJdbcUser, ITestJDBCResponse } from 'models/schemas';
import styled from 'styled-components';
import { TextFieldEvent } from 'types/react';

const { skeColor } = Palette;

enum JdcbTestState {
  NOT_STARTED,
  LOADING,
  RESPONSE,
}

export interface IJdbcConnectionProps {
  username?: string;
  jdbcUrl?: string;
  id?: string;
  password?: string;
  onTestJdbcConnectionForId?: (id: string) => void;
  onTestJdbcConnectionForUser?: (jdbcUser: IJdbcUser) => void;
  testJdbcConnectionResponse: ITestJDBCResponse;
  isDisabledFields: boolean;
  className?: string;
  hasPasswordField: boolean;
  canNotTest: boolean;
  handleJdbcChange?: (
    field: string
  ) => (event: TextFieldEvent, newValue?: string) => void;
}

export interface IJdbcConnectionState {
  jdcbTestState: JdcbTestState;
}

class JdbcConnection extends React.Component<
  IJdbcConnectionProps,
  IJdbcConnectionState
> {
  public state = {
    jdcbTestState: JdcbTestState.NOT_STARTED,
  };

  public handleTestJdbcConnection = async () => {
    const {
      onTestJdbcConnectionForId,
      onTestJdbcConnectionForUser,
      id,
      jdbcUrl,
      password,
      username,
    } = this.props;
    const handleJdbcLoading = () => {
      this.setState({
        jdcbTestState: JdcbTestState.RESPONSE,
      });
    };
    this.setState({
      jdcbTestState: JdcbTestState.LOADING,
    });
    if (onTestJdbcConnectionForId && id) {
      await onTestJdbcConnectionForId(id);
    } else if (onTestJdbcConnectionForUser) {
      if (onTestJdbcConnectionForUser && password && jdbcUrl && username) {
        await onTestJdbcConnectionForUser({
          password,
          jdbcUrl,
          username,
        });
      }
    }
    handleJdbcLoading();
  };

  public render() {
    const {
      testJdbcConnectionResponse,
      username,
      jdbcUrl,
      isDisabledFields,
      className,
      hasPasswordField,
      password,
      canNotTest,
      handleJdbcChange,
    } = this.props;
    const { jdcbTestState } = this.state;

    const displayLoadingOrNotStarted =
      jdcbTestState === JdcbTestState.LOADING ||
      jdcbTestState === JdcbTestState.NOT_STARTED;

    const displaySuccess =
      !displayLoadingOrNotStarted && testJdbcConnectionResponse.hasSucceeded;
    const displayFailure =
      !displayLoadingOrNotStarted && !testJdbcConnectionResponse.hasSucceeded;

    return (
      <div className={className}>
        <h3>Tilkoblingsinformasjon</h3>
        <TextField
          id={'username'}
          label={'Brukernavn'}
          value={username}
          disabled={isDisabledFields}
          onChange={handleJdbcChange && handleJdbcChange('username')}
        />
        {hasPasswordField && (
          <TextField
            id={'password'}
            label={'Passord'}
            value={password}
            disabled={isDisabledFields}
            onChange={handleJdbcChange && handleJdbcChange('password')}
            type="password"
          />
        )}
        <TextField
          id={'jdbcUrl'}
          label={'JDBC url'}
          value={jdbcUrl}
          disabled={isDisabledFields}
          help="jdbc:oracle:thin:@<db server>.skead.no:<port>/<sid>"
          onChange={handleJdbcChange && handleJdbcChange('jdbcUrl')}
        />
        <div className="styled-jdbc">
          <LoadingButton
            onClick={this.handleTestJdbcConnection}
            buttonStyle="primary"
            style={{ width: '100%' }}
            loading={jdcbTestState === JdcbTestState.LOADING}
            disabled={canNotTest}
          >
            TEST JDBC TILKOBLING
          </LoadingButton>
        </div>
        <p className="styled-jdbc-wrapper">
          Gyldig JDBC tilkobling:
          {displayLoadingOrNotStarted && (
            <span className="bold styled-jdbc-status">ikke testet</span>
          )}
          {displaySuccess && (
            <Icon
              className="styled-jdbc-status"
              iconName="Check"
              style={{ color: skeColor.green, fontSize: '30px' }}
            />
          )}
          {displayFailure && (
            <>
              <Icon
                className="styled-jdbc-status"
                iconName="Clear"
                style={{
                  color: skeColor.pink,
                  fontSize: '30px',
                }}
              />
              <p style={{ color: skeColor.error }}>
                {testJdbcConnectionResponse.message}
              </p>
            </>
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
  .ms-Callout-main {
    width: 380px;
  }
`;
