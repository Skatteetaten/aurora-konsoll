import * as React from 'react';
import styled from 'styled-components';

import Icon from 'aurora-frontend-react-komponenter/Icon';
import palette from 'aurora-frontend-react-komponenter/utils/palette';

import { IAuroraApiComponentProps } from 'components/AuroraApi';

import { IGoboUser } from 'services/auroraApiClients/goboUsageClient/query';
import { getGoboUsers } from 'state/actions';
import { connect } from 'react-redux';
import { RootState } from 'store/types';

const { skeColor } = palette;

interface IGoboUsageViewProps extends IAuroraApiComponentProps {
  goboUsers: IGoboUser[];
  getGoboUsers: () => void;
}

interface IGoboUsageViewState {
  users: IGoboUser[];
  isOpen: boolean;
}

class GoboUsageView extends React.Component<
  IGoboUsageViewProps,
  IGoboUsageViewState
> {
  public state: IGoboUsageViewState = {
    users: [],
    isOpen: false
  };

  public async getGoboUsers() {
    const { goboUsers } = this.props;

    const count = goboUsers
      .filter(it => it.name !== 'anonymous')
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
    this.setState({ users: count });
  }

  public async componentDidMount() {
    const { getGoboUsers } = this.props;
    await getGoboUsers();
  }

  public componentDidUpdate(prevProps: IGoboUsageViewProps) {
    if (
      JSON.stringify(prevProps.goboUsers) !==
      JSON.stringify(this.props.goboUsers)
    ) {
      this.getGoboUsers();
    }
  }

  public closeModal() {
    this.setState({
      isOpen: true
    });
  }

  public render() {
    return (
      <Dialog>
        <div>
          <Icon iconName="Favorite" style={{ fontSize: '32px' }} />
          <h3>Aurora champions</h3>
          <Icon iconName="Favorite" style={{ fontSize: '32px' }} />
        </div>
        <table style={{ width: '100%' }}>
          <tbody>
            <tr>
              <th>BrukerId</th>
              <th>Antall</th>
            </tr>
            {this.state.users.map(it => (
              <tr key={it.name}>
                <td>{it.name}</td>
                <td>{it.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <h4>Lukkes etter 10 sekunder</h4>
      </Dialog>
    );
  }
}

const Dialog = styled.div`
  background-color: ${skeColor.whiteGrey};
  z-index: 2000;
  height: 520px;
  width: 300px;
  position: fixed;
  top: 50%;
  left: 50%;
  margin-top: -250px;
  margin-left: -150px;
  font-size: 18px;
  table,
  th,
  td {
    border: 1px solid black;
    padding: 5px;
  }
  div {
    display: flex;
    justify-content: center;
    padding-top: 10px;
  }
`;

const mapStateToProps = (state: RootState) => ({
  goboUsers: state.startup.goboUsers
});

export const GoboUsageViewConnected = connect(
  mapStateToProps,
  {
    getGoboUsers: () => getGoboUsers()
  }
)(GoboUsageView);
