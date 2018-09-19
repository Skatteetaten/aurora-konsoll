import * as React from 'react';
import styled from 'styled-components';

import Button from 'aurora-frontend-react-komponenter/Button';
import DetailsList from 'aurora-frontend-react-komponenter/DetailsList';
import RadioButtonGroup from 'aurora-frontend-react-komponenter/RadioButtonGroup';

import Spinner from 'components/Spinner';
import { ImageTagType } from 'models/TagsPagedGroup';
import { ITag } from 'services/auroraApiClients';

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
    <VersionViewGrid>
      <div className="g-control-group">
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
      </div>
      <div className="g-details-list">
        <DetailsList
          columns={detailListColumns}
          items={tags}
          selectionPreservedOnEmptyClick={true}
          selectionMode={DetailsList.SelectionMode.single}
        />
      </div>
    </VersionViewGrid>
  );
};

const VersionViewGrid = styled.div`
  display: grid;
  grid-template-areas: 'control list list';
  grid-template-columns: 400px 1fr;
  grid-template-rows: auto 1fr;
  height: 100%;

  .g-control-group {
    grid-area: control;
  }
  .g-details-list {
    grid-area: list;
    overflow-x: hidden;
  }
`;

const ButtonWrapper = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 250px;

  button {
    margin: 20px 0 10px 0;
  }
`;

const detailListColumns = [
  {
    fieldName: 'name',
    isResizable: true,
    key: 'name',
    maxWidth: 400,
    minWidth: 100,
    name: 'Name'
  },
  {
    fieldName: 'lastModified',
    isResizable: true,
    key: 'lastModified',
    maxWidth: 200,
    minWidth: 100,
    name: 'Last modified'
  }
];

export default VersionView;
