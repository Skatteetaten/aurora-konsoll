import * as React from 'react';
import styled from 'styled-components';

import Button from 'aurora-frontend-react-komponenter/Button';
import DetailsList from 'aurora-frontend-react-komponenter/DetailsList';
import Grid from 'aurora-frontend-react-komponenter/Grid';
import RadioButtonGroup from 'aurora-frontend-react-komponenter/RadioButtonGroup';

import Spinner from 'components/Spinner';
import { versionStrategies } from 'services/AuroraApiClient/imageRepository/query';
import { ITag } from 'services/AuroraApiClient/types';

export interface IVersionStrategyOption {
  key: string;
  text: string;
}

const {
  AURORA_VERSION,
  BUGFIX,
  LATEST,
  MAJOR,
  MINOR,
  SNAPSHOT
} = versionStrategies;

const versionStategyOptions: IVersionStrategyOption[] = [
  { key: MAJOR, text: 'Major' },
  { key: MINOR, text: 'Minor' },
  { key: BUGFIX, text: 'Bugfix' },
  { key: LATEST, text: 'Latest' },
  { key: SNAPSHOT, text: 'Snapshot' },
  { key: AURORA_VERSION, text: 'Aurora version' }
];

interface IVersionViewProps {
  canLoadMore: boolean;
  loading: boolean;
  selectedStrategy: string;
  tags: ITag[];
  fetchTags: () => void;
  handleSelectedStrategy: (
    e: Event,
    option: { key: string; text: string }
  ) => void;
}

const VersionView = ({
  tags,
  loading,
  canLoadMore,
  selectedStrategy,
  fetchTags,
  handleSelectedStrategy
}: IVersionViewProps) => {
  return (
    <Grid>
      <Grid.Row>
        <Grid.Col lg={2}>
          <RadioButtonGroup
            defaultSelectedKey={selectedStrategy}
            options={versionStategyOptions}
            onChange={handleSelectedStrategy}
          />
          <ButtonWrapper>
            <Button
              buttonType="primaryRounded"
              onClick={fetchTags}
              disabled={!canLoadMore}
            >
              {loading ? <Spinner /> : 'Load more'}
            </Button>
            <Button buttonType="primary">Update</Button>
          </ButtonWrapper>
        </Grid.Col>
        <Grid.Col lg={8} lgPush={1}>
          <DetailsList
            columns={detailListColumns}
            items={tags}
            selectionPreservedOnEmptyClick={true}
            selectionMode={DetailsList.SelectionMode.single}
          />
        </Grid.Col>
      </Grid.Row>
    </Grid>
  );
};

const ButtonWrapper = styled.div`
  display: flex;
  flex-direction: column;

  button {
    margin: 20px 0 10px 0;
  }
`;

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

export default VersionView;
