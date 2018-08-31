import * as React from 'react';
import { NavLink, Route } from 'react-router-dom';
import styled from 'styled-components';

import Card from 'aurora-frontend-react-komponenter/Card';
import Grid from 'aurora-frontend-react-komponenter/Grid';
import palette from 'aurora-frontend-react-komponenter/utils/palette';

import { IApplicationDeployment } from 'services/AuroraApiClient/types';
import { ApplicationDeploymentDetailsRoute } from '../ApplicationDeploymentSelector';
import InformationViewBase from './InformationView';
import { VersionViewWithApi } from './VersionView';

const { skeColor } = palette;

export interface IDetailsViewProps extends ApplicationDeploymentDetailsRoute {
  deployment: IApplicationDeployment;
}

const DetailsView = ({ deployment, match }: IDetailsViewProps) => {
  const InformationView = () => <InformationViewBase deployment={deployment} />;
  const VersionView = () => (
    <VersionViewWithApi repository={deployment.repository} />
  );

  const title = `${deployment.environment}/${deployment.name}`;
  return (
    <Grid>
      <Grid.Row rowSpacing={Grid.SPACE_NONE}>
        <h1>{title}</h1>
      </Grid.Row>
      <Grid.Row rowSpacing={Grid.SPACE_NONE}>
        <StyledColumn lg={6}>
          <TabLink to={`${match.url}/info`}>Informasjon</TabLink>
        </StyledColumn>
        <StyledColumn lg={6}>
          <TabLink to={`${match.url}/version`}>Versjoner</TabLink>
        </StyledColumn>
      </Grid.Row>
      <Grid.Row rowSpacing={Grid.SPACE_NONE}>
        <StyledColumn lg={12}>
          <Card color={Card.GREEN}>
            <Route path={`${match.path}/info`} render={InformationView} />
            <Route path={`${match.path}/version`} render={VersionView} />
          </Card>
        </StyledColumn>
      </Grid.Row>
    </Grid>
  );
};

const TabLink = styled(NavLink)`
  display: block;
  padding: 15px 0 5px;
  text-align: center;
  font-size: 18px;
  border-bottom: 3px solid ${skeColor.lightBlue};
  text-decoration: none;
  border-collapse: collapse;
  color: black;
  &:hover {
    border-bottom: 3px solid ${skeColor.mediumBlue};
  }
`;

TabLink.defaultProps = {
  activeStyle: {
    borderBottom: `3px solid ${skeColor.blue}`
  }
};

const StyledColumn = styled(Grid.Col)`
  padding: 0;
`;

export default DetailsView;
