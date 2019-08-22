import * as React from 'react';
import styled from 'styled-components';

import Button from 'aurora-frontend-react-komponenter/Button';
import TextField from 'aurora-frontend-react-komponenter/TextField';

import Spinner from 'components/Spinner';
import { ImageTagType } from 'models/ImageTagType';
import { ITag, ITagsPaged, ITagsPagedGroup } from 'models/Tag';

import UnavailableServiceMessage from 'components/UnavailableServiceMessage';
import { IUnavailableServiceMessage } from 'models/UnavailableServiceMessage';
import TagsList from './TagsList';
import TagTypeSelector, {
  IImageTagTypeOption
} from './TagTypeSelector/TagTypeSelector';
import MessageBar from 'aurora-frontend-react-komponenter/MessageBar';

interface IVersionViewProps {
  hasPermissionToUpgrade: boolean;
  isFetchingTags: boolean;
  isRedeploying: boolean;
  canUpgrade: (selectedTag?: ITag) => boolean;
  initialTagType: string;
  unavailableMessage?: IUnavailableServiceMessage;
  selectedTagType: ImageTagType;
  tagsPaged: ITagsPaged;
  deployedTag: ITag;
  selectedTag?: ITag;
  className?: string;
  findGroupedTagsPagedResult: ITagsPagedGroup;
  versionSearchText: string;
  handlefetchTags: () => void;
  handleSelectStrategy: (e: Event, option: IImageTagTypeOption) => void;
  handleVersionSearch: (value: string) => void;
  redeployWithVersion: (version?: ITag) => void;
  redeployWithCurrentVersion: () => void;
  handleSelectNextTag: (item?: ITag) => void;
}

const VersionView = ({
  tagsPaged,
  isFetchingTags,
  isRedeploying,
  unavailableMessage,
  canUpgrade,
  initialTagType,
  hasPermissionToUpgrade,
  findGroupedTagsPagedResult,
  selectedTagType,
  handlefetchTags,
  selectedTag,
  deployedTag,
  className,
  handleSelectStrategy,
  handleVersionSearch,
  redeployWithVersion,
  redeployWithCurrentVersion,
  handleSelectNextTag,
  versionSearchText
}: IVersionViewProps) => {
  if (unavailableMessage) {
    return <UnavailableServiceMessage message={unavailableMessage} />;
  }

  const loadMoreTagsMessage = () => {
    if (!tagsPaged.hasNextPage) {
      return 'Søk etter nye';
    }
    return 'Last inn 15 flere';
  };

  return (
    <div className={className}>
      {hasPermissionToUpgrade ? null : (
        <MessageBar>
          Ikke mulig å deploye nåværende eller annen versjon. Årsak: Mangler
          admin rettigheter.
        </MessageBar>
      )}
      <div className="g-action-bar">
        <TagTypeSelector
          imageTagType={selectedTagType}
          handleSelectStrategy={handleSelectStrategy}
          findGroupedTagsPagedResult={findGroupedTagsPagedResult}
        />
        <div style={{ width: 300, paddingLeft: 20 }}>
          <TextField
            placeholder="Listen oppdateres når du skriver"
            onChanged={handleVersionSearch}
            iconProps={{ iconName: 'Search' }}
          />
        </div>
      </div>
      <div className="g-details-list">
        <TagsList
          tags={tagsPaged.tags}
          imageTagType={selectedTagType}
          selectedTag={selectedTag}
          deployedTag={deployedTag}
          initialTagType={initialTagType}
          handlefetchTags={handlefetchTags}
          handleSelectNextTag={handleSelectNextTag}
          canUpgrade={canUpgrade}
          isRedeploying={isRedeploying}
          redeployWithVersion={redeployWithVersion}
          redeployWithCurrentVersion={redeployWithCurrentVersion}
          versionSearchText={versionSearchText}
          hasPermissionToUpgrade={hasPermissionToUpgrade}
        />
      </div>
      <div className="tags-action">
        <div>{`Viser ${tagsPaged.tags.length} av ${
          tagsPaged.totalCount
        } tags`}</div>
        <div>
          <Button
            icon="History"
            buttonType="primaryRoundedFilled"
            onClick={handlefetchTags}
            disabled={isFetchingTags}
            style={{
              minWidth: '195px'
            }}
          >
            {isFetchingTags ? <Spinner /> : loadMoreTagsMessage()}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default styled(VersionView)`
  margin: 0 auto;
  height: 100%;
  width: 1300;
  margin-left: 30px;
  max-width: 1400px;

  .g-action-bar {
    margin-bottom: 10px;
    max-width: 850px;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
  }

  .g-control-group {
  }
  .g-details-list {
    max-width: 1400px;
    max-height: 800px;
    margin-top: 30px;
    overflow-x: hidden;
  }

  .tags-action {
    width: 1400px;
    text-align: center;
  }

  .tags-action > div:first-child {
    margin: 20px 0 15px 0;
  }

  .unavailable-upgrade-message {
    margin-top: 30px;
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
