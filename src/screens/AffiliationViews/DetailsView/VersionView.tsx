import * as React from 'react';
import styled from 'styled-components';

import Button from 'aurora-frontend-react-komponenter/Button';
import DetailsList from 'aurora-frontend-react-komponenter/DetailsList';
import TextField from 'aurora-frontend-react-komponenter/TextField';

import Spinner from 'components/Spinner';
import { ImageTagType } from 'models/TagsPagedGroup';
import { ITag } from 'services/auroraApiClients';
import TagTypeSelector, { IVersionStrategyOption } from './TagTypeSelector';

interface IVersionViewProps {
  canLoadMore: boolean;
  loading: boolean;
  imageTagType: ImageTagType;
  tags: ITag[];
  fetchTags: () => void;
  handleSelectedStrategy: (e: Event, option: IVersionStrategyOption) => void;
  handleVersionSearch: (value: string) => void;
}

const VersionView = ({
  tags,
  loading,
  canLoadMore,
  imageTagType,
  fetchTags,
  handleSelectedStrategy,
  handleVersionSearch
}: IVersionViewProps) => {
  return (
    <VersionViewGrid>
      <div className="g-control-group">
        <TagTypeSelector
          imageTagType={imageTagType}
          handleSelectedStrategy={handleSelectedStrategy}
        />
        <ButtonWrapper>
          <Button buttonType="primary">Update</Button>
        </ButtonWrapper>
      </div>
      <div className="g-action-bar">
        <TextField label="Søk etter versjon" onChanged={handleVersionSearch} />
        <Button
          buttonType="primaryRounded"
          onClick={fetchTags}
          disabled={!canLoadMore}
          style={{
            minWidth: '150px'
          }}
        >
          {loading ? <Spinner /> : 'Load more'}
        </Button>
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
  margin: 0 auto;
  display: grid;
  grid-template-areas:
    'control actionbar'
    'control list';
  grid-template-columns: 350px 1fr;
  grid-template-rows: auto 1fr;
  height: 100%;

  .g-action-bar {
    grid-area: actionbar;
    margin-left: 30px;
    margin-bottom: 10px;
    max-width: 800px;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
  }

  .g-control-group {
    grid-area: control;
  }
  .g-details-list {
    grid-area: list;
    max-width: 800px;
    margin-left: 30px;
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
