import * as React from 'react';
import styled from 'styled-components';

import Button from 'aurora-frontend-react-komponenter/Button';
import DetailsList from 'aurora-frontend-react-komponenter/DetailsList';
import Grid from 'aurora-frontend-react-komponenter/Grid';
import RadioButtonGroup from 'aurora-frontend-react-komponenter/RadioButtonGroup';

import Spinner from 'components/Spinner';
import { ImageTagType } from 'services/AuroraApiClient/imageRepository/query';
import { ITag } from 'services/AuroraApiClient/types';

export interface IVersionStrategyOption {
  key: ImageTagType;
  text: string;
}

const versionStategyOptions: IVersionStrategyOption[] = [
  { key: ImageTagType.MAJOR, text: 'Major' },
  { key: ImageTagType.MINOR, text: 'Minor' },
  { key: ImageTagType.BUGFIX, text: 'Bugfix' },
  { key: ImageTagType.LATEST, text: 'Latest' },
  { key: ImageTagType.SNAPSHOT, text: 'Snapshot' },
  { key: ImageTagType.AURORA_VERSION, text: 'Aurora version' }
];

interface IVersionViewProps {
  canLoadMore: boolean;
  loading: boolean;
  imageTagType: ImageTagType;
  tags: ITag[];
  fetchTags: () => void;
  handleSelectedStrategy: (e: Event, option: IVersionStrategyOption) => void;
}

const VersionView = ({
  tags,
  loading,
  canLoadMore,
  imageTagType,
  fetchTags,
  handleSelectedStrategy
}: IVersionViewProps) => {
  return (
    <Grid>
      <Grid.Row>
        <Grid.Col lg={2}>
          <RadioButtonGroup
            defaultSelectedKey={imageTagType}
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
