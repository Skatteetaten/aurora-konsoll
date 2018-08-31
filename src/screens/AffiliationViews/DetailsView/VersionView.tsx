import * as React from 'react';
import styled from 'styled-components';

import Button from 'aurora-frontend-react-komponenter/Button';
import DetailsList from 'aurora-frontend-react-komponenter/DetailsList';
import Grid from 'aurora-frontend-react-komponenter/Grid';
import RadioButtonGroup from 'aurora-frontend-react-komponenter/RadioButtonGroup';

import { IAuroraApiComponentProps, withAuroraApi } from 'components/AuroraApi';
import Spinner from 'components/Spinner';
import {
  IGroupedTagsCursors,
  ITagsGrouped
} from 'services/AuroraApiClient/tags';
import { ITag, ITagsPaged } from 'services/AuroraApiClient/types';

interface IVersionViewProps extends IAuroraApiComponentProps {
  repository: string;
}

interface IVersionViewState {
  cursors: IGroupedTagsCursors;
  groupedTags?: ITagsGrouped;
  selectedStrategy: string;
  loading: boolean;
}

class VersionView extends React.Component<
  IVersionViewProps,
  IVersionViewState
> {
  public state: IVersionViewState = {
    cursors: {},
    loading: false,
    selectedStrategy: 'major'
  };

  public fetchTags = async () => {
    const { cursors } = this.state;
    const { clients, repository } = this.props;

    this.setState(() => ({
      loading: true
    }));

    const result = await clients.apiClient.findGroupedTagsPaged(
      repository,
      cursors
    );

    const getCursor = (tagsPaged: ITagsPaged): string | undefined => {
      return tagsPaged.hasNextPage ? tagsPaged.endCursor : undefined;
    };

    this.setState(() => ({
      cursors: {
        auroraVersionCursor: getCursor(result.auroraVersion),
        majorCursor: getCursor(result.major),
        minorCursor: getCursor(result.minor),
        patchCursor: getCursor(result.patch),
        snapshotCursor: getCursor(result.snapshot)
      },
      groupedTags: result,
      loading: false
    }));
  };

  public handleSelectedStrategy = (
    e: Event,
    option: { key: string; text: string }
  ) => {
    e.preventDefault();
    this.setState(() => ({
      selectedStrategy: option.key
    }));
  };

  public componentDidMount() {
    this.fetchTags();
  }

  public render() {
    const { groupedTags, selectedStrategy } = this.state;

    if (!groupedTags) {
      return false;
    }

    const currentStrategy: ITagsPaged = groupedTags[selectedStrategy];

    const sortedTags = currentStrategy.tags.sort(sortTagsByDate).map(tag => ({
      lastModified: new Date(tag.lastModified).toLocaleString('nb-NO'),
      name: tag.name
    }));

    return (
      <Grid>
        <Grid.Row>
          <Grid.Col lg={2}>
            <RadioButtonGroup
              defaultSelectedKey={this.state.selectedStrategy}
              options={versionStrategies}
              onChange={this.handleSelectedStrategy}
            />
            <ButtonWrapper>
              <Button buttonType="primaryRounded" onClick={this.fetchTags}>
                {this.state.loading ? <Spinner /> : 'Load more'}
              </Button>
              <Button buttonType="primary">Update</Button>
            </ButtonWrapper>
          </Grid.Col>
          <Grid.Col lg={8} lgPush={1}>
            <DetailsList
              columns={detailListColumns}
              items={sortedTags}
              selectionPreservedOnEmptyClick={true}
              selectionMode={DetailsList.SelectionMode.single}
              onChange={console.log}
            />
          </Grid.Col>
        </Grid.Row>
      </Grid>
    );
  }
}

const ButtonWrapper = styled.div`
  display: flex;
  flex-direction: column;

  button {
    margin: 20px 0 10px 0;
  }
`;

const sortTagsByDate = (t1: ITag, t2: ITag) => {
  const date1 = new Date(t1.lastModified).getTime();
  const date2 = new Date(t2.lastModified).getTime();
  return date2 - date1;
};

const detailListColumns = [
  {
    fieldName: 'name',
    isResizable: true,
    key: 'name',
    maxWidth: 600,
    minWidth: 50,
    name: 'Name'
  },
  {
    fieldName: 'lastModified',
    isResizable: true,
    key: 'lastModified',
    maxWidth: 200,
    minWidth: 50,
    name: 'Last modified'
  }
];

const versionStrategies = [
  { key: 'major', text: 'Major' },
  { key: 'minor', text: 'Minor' },
  { key: 'patch', text: 'Patch' },
  { key: 'snapshot', text: 'Snapshot' },
  { key: 'auroraVersion', text: 'Aurora version' }
];

export const VersionViewWithApi = withAuroraApi(VersionView);

export default VersionView;
