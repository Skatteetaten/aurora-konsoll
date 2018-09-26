import * as React from 'react';
import styled from 'styled-components';

import Button from 'aurora-frontend-react-komponenter/Button';
import TextField from 'aurora-frontend-react-komponenter/TextField';

import Spinner from 'components/Spinner';
import { ITag } from 'services/auroraApiClients';
import { ImageTagType } from 'services/TagStateManager';
import TagsList from './TagsList';
import TagTypeSelector, { IImageTagTypeOption } from './TagTypeSelector';

interface IVersionViewProps {
  canLoadMore: boolean;
  isFetchingTags: boolean;
  isRedeploying: boolean;
  canUpgrade: boolean;
  imageTagType: ImageTagType;
  tags: ITag[];
  deployedTag: ITag;
  selectedTag?: ITag;
  className?: string;
  handlefetchTags: () => void;
  handleSelectedStrategy: (e: Event, option: IImageTagTypeOption) => void;
  handleVersionSearch: (value: string) => void;
  redeployWithVersion: () => void;
  handleSelectNextTag: (item: ITag) => void;
}

const VersionView = ({
  tags,
  isFetchingTags,
  isRedeploying,
  canLoadMore,
  canUpgrade,
  imageTagType,
  handlefetchTags,
  selectedTag,
  deployedTag,
  className,
  handleSelectedStrategy,
  handleVersionSearch,
  redeployWithVersion,
  handleSelectNextTag
}: IVersionViewProps) => {
  return (
    <div className={className}>
      <div className="g-control-group">
        <TagTypeSelector
          imageTagType={imageTagType}
          handleSelectedStrategy={handleSelectedStrategy}
        />
        <ButtonWrapper>
          <Button
            buttonType="primary"
            onClick={redeployWithVersion}
            disabled={!canUpgrade}
          >
            {isRedeploying ? <Spinner /> : 'Oppgrader'}
          </Button>
        </ButtonWrapper>
      </div>
      <div className="g-action-bar">
        <TextField label="Søk etter versjon" onChanged={handleVersionSearch} />
        <Button
          buttonType="primaryRounded"
          onClick={handlefetchTags}
          disabled={!canLoadMore}
          style={{
            minWidth: '160px'
          }}
        >
          {isFetchingTags ? <Spinner /> : 'Hent flere tags'}
        </Button>
      </div>
      <div className="g-details-list">
        <TagsList
          tags={tags}
          imageTagType={imageTagType}
          selectedTag={selectedTag}
          deployedTag={deployedTag}
          handleSelectNextTag={handleSelectNextTag}
        />
      </div>
    </div>
  );
};

export default styled(VersionView)`
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
