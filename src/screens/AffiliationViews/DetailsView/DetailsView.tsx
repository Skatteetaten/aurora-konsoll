import * as React from 'react';
import { Route } from 'react-router-dom';
import styled from 'styled-components';

import palette from 'aurora-frontend-react-komponenter/utils/palette';

import { IAuroraApiComponentProps, withAuroraApi } from 'components/AuroraApi';
import TabLink from 'components/TabLink';
import { ImageTagType, TagsPagedGroup } from 'models/TagsPagedGroup';
import {
  IApplicationDeployment,
  ITag,
  ITagsPaged
} from 'services/auroraApiClients';

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

  public loadMoreTags = async () => {
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

    const tagsPaged = await clients.imageRepositoryClient.findTagsPaged(
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

    const groupedTags = await clients.imageRepositoryClient.findGroupedTagsPaged(
      deployment.repository
    );

    this.setState(() => ({
      groupedTags,
      loading: false
    }));
  }

  public render() {
    const { deployment, match } = this.props;
    const { loading, imageTagType } = this.state;

    const InformationView = () => (
      <InformationViewBase deployment={deployment} />
    );
    const VersionView = () => (
      <VersionViewBase
        canLoadMore={this.canLoadMoreTags()}
        fetchTags={this.loadMoreTags}
        handleSelectedStrategy={this.handleSelectedStrategy}
        loading={loading}
        imageTagType={imageTagType}
        tags={this.getSortedImageTags()}
      />
    );

    const title = `${deployment.environment}/${deployment.name}`;
    return (
      <DetailsViewGrid>
        <h1>{title}</h1>
        <TabLinkWrapper>
          <TabLink to={`${match.url}/info`}>Informasjon</TabLink>
          <TabLink to={`${match.url}/version`}>Versjoner</TabLink>
        </TabLinkWrapper>
        <Card>
          <Route path={`${match.path}/info`} render={InformationView} />
          <Route path={`${match.path}/version`} render={VersionView} />
        </Card>
      </DetailsViewGrid>
    );
  }
  private getSortedImageTags = () => {
    const { groupedTags, imageTagType } = this.state;

    const sortTagsByDate = (t1: ITag, t2: ITag) => {
      const date1 = new Date(t1.lastModified).getTime();
      const date2 = new Date(t2.lastModified).getTime();
      return date2 - date1;
    };

    if (!groupedTags) {
      return [];
    }

    return groupedTags
      .getTagsPaged(imageTagType)
      .tags.sort(sortTagsByDate)
      .map(tag => ({
        lastModified: new Date(tag.lastModified).toLocaleString('nb-NO'),
        name: tag.name
      }));
  };

  private canLoadMoreTags = () => {
    const { groupedTags, imageTagType } = this.state;
    return !!groupedTags && groupedTags.getTagsPaged(imageTagType).hasNextPage;
  };
}

const { skeColor } = palette;

const DetailsViewGrid = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 0 8px;
`;

const TabLinkWrapper = styled.div`
  display: flex;

  a {
    flex: 1;
  }
`;

const Card = styled.div`
  flex: 1;
  padding: 16px;
  overflow: hidden;
  background-color: ${skeColor.lightGreen};
`;

export const DetailsViewBaseWithApi = withAuroraApi(DetailsView);

export default DetailsView;
