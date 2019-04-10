import * as React from 'react';
import styled from 'styled-components';

import Icon from 'aurora-frontend-react-komponenter/Icon';
import palette from 'aurora-frontend-react-komponenter/utils/palette';

import { IAuroraApiComponentProps } from 'components/AuroraApi';

import { IGoboUser } from 'services/auroraApiClients/goboUsageClient/query';

const { skeColor } = palette;

interface IGoboUsageViewState {
  users: IGoboUser[];
  isOpen: boolean;
}

class GoboUsageView extends React.Component<
  IAuroraApiComponentProps,
  IGoboUsageViewState
> {
  public state: IGoboUsageViewState = {
    users: [],
    isOpen: false
  };

  public async getGoboUsers() {
    const usersGobo: IGoboUser[] = await this.props.clients.goboUsageClient.getGoboUsers();

    const count = usersGobo
      .filter(it => it.name !== 'anonymous')
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
    this.setState({ users: count });
  }

  public async componentDidMount() {
    await this.getGoboUsers();
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
          <h3>Gobo Champions</h3>
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

export default GoboUsageView;
