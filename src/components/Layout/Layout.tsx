import FooterContent from 'aurora-frontend-react-komponenter/FooterContent';
import Grid from 'aurora-frontend-react-komponenter/Grid';
import SkeBasis from 'aurora-frontend-react-komponenter/SkeBasis';
import TopBanner from 'aurora-frontend-react-komponenter/TopBanner';
import * as React from 'react';

export class Layout extends React.Component {
  public render() {
    return (
      <SkeBasis>
        <TopBanner
          external={true}
          compact={true}
          homeText="Til skatteetaten.no"
          title="Aurora Konsoll"
        />
        {this.props.children}
        <FooterContent>
          <Grid>
            <Grid.Row>
              <Grid.Col sm={12} lg={12} xl={3}>
                <FooterContent.Logo />
              </Grid.Col>
              <Grid.Col sm={12} lg={12} xl={3}>
                Annet innhold
              </Grid.Col>
            </Grid.Row>
          </Grid>
        </FooterContent>
      </SkeBasis>
    );
  }
}
