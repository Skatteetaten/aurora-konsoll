import * as React from 'react';
import { Route } from 'react-router-dom';
import styled from 'styled-components';

import Card from 'aurora-frontend-react-komponenter/Card';
import Grid from 'aurora-frontend-react-komponenter/Grid';

import { IAuroraApiComponentProps, withAuroraApi } from 'components/AuroraApi';
import TabLink from 'components/TabLink';
import {
  IApplicationDeployment,
  ITag,
  ITagsPaged
} from 'services/AuroraApiClient/types';

import { ImageTagType } from 'services/AuroraApiClient/imageRepository/query';
import { TagsPagedGroup } from 'services/AuroraApiClient/imageRepository/TagsPagedGroup';
import { ApplicationDeploymentDetailsRoute } from '../ApplicationDeploymentSelector';
import InformationViewBase from './InformationView';
import VersionViewBase, { IVersionStrategyOption } from './VersionView';

interface IDetailsViewState {
  groupedTags?: TagsPagedGroup;
  imageTagType: ImageTagType;
  loading: boolean;
}

interface IDetailsViewProps
  extends ApplicationDeploymentDetailsRoute,
    IAuroraApiComponentProps {
  deployment: IApplicationDeployment;
}

class DetailsView extends React.Component<
  IDetailsViewProps,
  IDetailsViewState
> {
  public state: IDetailsViewState = {
    imageTagType: ImageTagType.MAJOR,
    loading: false
  };

  public loadMore = async () => {
    const { clients, deployment } = this.props;
    const { groupedTags, imageTagType } = this.state;

    this.setState(() => ({
      loading: true
    }));

    let cursor;
    if (groupedTags) {
      const current: ITagsPaged = groupedTags.getTagsPaged(imageTagType);
      cursor = current.endCursor;
    }

    const tagsPaged = await clients.apiClient.findTagsPaged(
      deployment.repository,
      15,
      cursor,
      [imageTagType]
    );

    this.setState(state => {
      const currentGroupedTags = state.groupedTags;
      return {
        groupedTags:
          currentGroupedTags &&
          currentGroupedTags.updateTagsPaged(imageTagType, tagsPaged),
        loading: false
      };
    });
  };

  public handleSelectedStrategy = (
    e: Event,
    option: IVersionStrategyOption
  ) => {
    e.preventDefault();
    this.setState(() => ({
      imageTagType: option.key
    }));
  };

  public async componentDidMount() {
    const { clients, deployment } = this.props;

    this.setState(() => ({
      loading: true
    }));

    const groupedTags = await clients.apiClient.findGroupedTagsPaged(
      deployment.repository
    );

    this.setState(() => ({
      groupedTags,
      loading: false
    }));
  }

  public render() {
    const { deployment, match } = this.props;
    const { groupedTags, loading, imageTagType } = this.state;

    let sortedTags: ITag[] = [];
    let currentTagsPaged: ITagsPaged = {
      endCursor: '',
      hasNextPage: false,
      tags: []
    };

    if (groupedTags) {
      currentTagsPaged = groupedTags.getTagsPaged(imageTagType);
      sortedTags = currentTagsPaged.tags.sort(sortTagsByDate).map(tag => ({
        lastModified: new Date(tag.lastModified).toLocaleString('nb-NO'),
        name: tag.name
      }));
    }

    const InformationView = () => (
      <InformationViewBase deployment={deployment} />
    );
    const VersionView = () => (
      <VersionViewBase
        canLoadMore={currentTagsPaged.hasNextPage}
        fetchTags={this.loadMore}
        handleSelectedStrategy={this.handleSelectedStrategy}
        loading={loading}
        imageTagType={imageTagType}
        tags={sortedTags}
      />
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
  }
}

const sortTagsByDate = (t1: ITag, t2: ITag) => {
  const date1 = new Date(t1.lastModified).getTime();
  const date2 = new Date(t2.lastModified).getTime();
  return date2 - date1;
};

const StyledColumn = styled(Grid.Col)`
  padding: 0;
`;

export const DetailsViewBaseWithApi = withAuroraApi(DetailsView);

export default DetailsView;
