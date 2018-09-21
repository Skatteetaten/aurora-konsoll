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
import { IDeploymentSpec } from 'services/auroraApiClients/applicationDeploymentClient/DeploymentSpec';

import { Label } from 'screens/HomeView/Home';
import { ApplicationDeploymentDetailsRoute } from '../ApplicationDeploymentSelector';
import InformationViewBase from './InformationView';
import { IVersionStrategyOption } from './TagTypeSelector';
import VersionViewBase from './VersionView';

interface IDetailsViewState {
  groupedTags?: TagsPagedGroup;
  deploymentSpec?: IDeploymentSpec;
  imageTagType: ImageTagType;
  loading: boolean;
  versionSearchText: string;
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
    loading: false,
    versionSearchText: ''
  };

  constructor(props: IDetailsViewProps) {
    super(props);
    this.state.imageTagType = props.deployment.version.deployTag.type;
  }

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

  public handleVersionSearch = (value: string) => {
    this.setState({
      versionSearchText: value
    });
  };

  public async componentDidMount() {
    const { clients, deployment } = this.props;

    this.setState(() => ({
      loading: true
    }));

    const spec = await clients.applicationDeploymentClient.findDeploymentSpec(
      deployment.environment,
      deployment.name
    );
    this.setState(() => ({
      deploymentSpec: spec
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
    const { deploymentSpec, loading, imageTagType } = this.state;

    const InformationView = () => (
      <InformationViewBase
        deployment={deployment}
        deploymentSpec={deploymentSpec}
      />
    );
    const VersionView = () => (
      <VersionViewBase
        canLoadMore={this.canLoadMoreTags()}
        fetchTags={this.loadMoreTags}
        handleSelectedStrategy={this.handleSelectedStrategy}
        handleVersionSearch={this.handleVersionSearch}
        loading={loading}
        imageTagType={imageTagType}
        tags={this.getTagsForType(imageTagType)}
      />
    );

    const title = `${deployment.environment}/${deployment.name}`;
    return (
      <DetailsViewGrid>
        <div className="labels">
          <Label text="deployment" subText={title} />
          <Label text="Tag" subText={deployment.version.deployTag.name} />
          <Label text="Versjon" subText={deployment.version.auroraVersion} />
        </div>
        <TabLinkWrapper>
          <TabLink to={`${match.url}/info`}>Informasjon</TabLink>
          <TabLink to={`${match.url}/version`}>Oppgradering</TabLink>
        </TabLinkWrapper>
        <Card>
          <Route path={`${match.path}/info`} render={InformationView} />
          <Route path={`${match.path}/version`} render={VersionView} />
        </Card>
      </DetailsViewGrid>
    );
  }
  private getTagsForType = (imageTagType: ImageTagType): ITag[] => {
    const { groupedTags, versionSearchText } = this.state;

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
      .tags.filter(v => {
        return (
          versionSearchText.length === 0 ||
          v.name.search(versionSearchText) !== -1
        );
      })
      .sort(sortTagsByDate)
      .map(tag => ({
        ...tag,
        lastModified: new Date(tag.lastModified).toISOString()
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

  .labels {
    display: flex;
    margin: 10px 0 20px 0;
  }
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
  overflow-x: hidden;
  height: 100%;
  background-color: ${skeColor.lightGreen};
`;

export const DetailsViewBaseWithApi = withAuroraApi(DetailsView);

export default DetailsView;
