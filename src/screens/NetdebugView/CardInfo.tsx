import * as React from 'react';

import Card from 'aurora-frontend-react-komponenter/Card';
import Grid from 'aurora-frontend-react-komponenter/Grid';
import styled from 'styled-components';

import Indicator, { IndicatorColor } from './Indicator';

const Centering = styled.div`
  text-align: center;
  > h3 {
    color: grey;
  }
  > h1 {
    margin: 0;
  }

  > p {
    margin: 0;
  }
`;

const ClickableTextToShowTable = styled.a`
  color: blue;
  cursor: pointer;
  &:hover {
    color: red;
    background-color: transparent;
    text-decoration: underline;
  }
`;

interface ICardProps {
  netdebugStatus: string;
  showCard: boolean;
  hostnameValue: string;
  portValue: string;
  displayTableOnClicked: () => void;
}

interface ICardState {
  indicatorColor: IndicatorColor;
}

class CardInfo extends React.Component<ICardProps, ICardState> {
  public state = {
    indicatorColor: IndicatorColor.RED,
    showTable: false
  };

  public setCardInfo = (color: IndicatorColor) => {
    this.setState(() => ({
      indicatorColor: color
    }));
  };

  public componentWillMount() {
    if (this.props.netdebugStatus === 'OPEN') {
      this.setCardInfo(IndicatorColor.GREEN);
    } else if (this.props.netdebugStatus === ('DNS_FAILED' || 'UNKOWN')) {
      this.setCardInfo(IndicatorColor.RED);
    }
  }

  public render() {
    return (
      <Grid.Row>
        <Grid.Col lg={6}>
          {this.props.showCard && (
            <Card>
              <Grid>
                <Grid.Row>
                  <Indicator color={this.state.indicatorColor} />
                  <Centering>
                    <h1>{this.props.netdebugStatus}</h1>
                  </Centering>
                </Grid.Row>
                <Grid.Row>
                  <Centering>
                    <h3>
                      {this.props.hostnameValue}:{this.props.portValue}
                    </h3>
                    <p>
                      {this.props.netdebugStatus === 'OPEN' && (
                        <>Kan nåes fra alle noder.</>
                      )}{' '}
                      Klikk{' '}
                      <ClickableTextToShowTable
                        onClick={this.props.displayTableOnClicked}
                      >
                        her
                      </ClickableTextToShowTable>{' '}
                      for mer informasjon.
                    </p>
                  </Centering>
                </Grid.Row>
              </Grid>
            </Card>
          )}
        </Grid.Col>
      </Grid.Row>
    );
  }
}

export default CardInfo;
