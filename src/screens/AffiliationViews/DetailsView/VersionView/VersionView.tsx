import * as React from 'react';
import styled from 'styled-components';

import Button from 'aurora-frontend-react-komponenter/Button';
import TextField from 'aurora-frontend-react-komponenter/TextField';

import Spinner from 'components/Spinner';
import { ImageTagType } from 'models/ImageTagType';
import { ITag, ITagsPaged } from 'models/Tag';

import UnavailableServiceMessage from 'components/UnavailableServiceMessage';
import { IUnavailableServiceMessage } from 'models/UnavailableServiceMessage';
import TagsList from './TagsList';
import TagTypeSelector, {
  IImageTagTypeOption
} from './TagTypeSelector/TagTypeSelector';
import UpgradeVersionDialog from './UpgradeVersionDialog';

interface IVersionViewProps {
  hasPermissionToUpgrade: boolean;
  isFetchingTags: boolean;
  isRedeploying: boolean;
  isRedeployingCurrentVersion: boolean;
  canUpgrade: boolean;
  unavailableMessage?: IUnavailableServiceMessage;
  selectedTagType: ImageTagType;
  tagsPaged: ITagsPaged;
  deployedTag: ITag;
  selectedTag?: ITag;
  className?: string;
  handlefetchTags: () => void;
  handleSelectStrategy: (e: Event, option: IImageTagTypeOption) => void;
  handleVersionSearch: (value: string) => void;
  redeployWithVersion: () => void;
  redeployWithCurrentVersion: () => void;
  handleSelectNextTag: (item: ITag) => void;
}

const VersionView = ({
  tagsPaged,
  isFetchingTags,
  isRedeploying,
  isRedeployingCurrentVersion,
  unavailableMessage,
  canUpgrade,
  hasPermissionToUpgrade,
  selectedTagType,
  handlefetchTags,
  selectedTag,
  deployedTag,
  className,
  handleSelectStrategy,
  handleVersionSearch,
  redeployWithVersion,
  redeployWithCurrentVersion,
  handleSelectNextTag
}: IVersionViewProps) => {
  if (unavailableMessage) {
    return <UnavailableServiceMessage message={unavailableMessage} />;
  }
  return (
    <div className={className}>
      <div className="g-control-group">
        <TagTypeSelector
          imageTagType={selectedTagType}
          handleSelectStrategy={handleSelectStrategy}
        />
        {hasPermissionToUpgrade ? (
          <ButtonWrapper>
            <UpgradeVersionDialog
              previousVersion={deployedTag.name}
              newVersion={selectedTag && selectedTag.name}
              isRedeploying={isRedeploying}
              isRedeployingCurrentVersion={isRedeployingCurrentVersion}
              redeployWithVersion={redeployWithVersion}
              redeployWithCurrentVersion={redeployWithCurrentVersion}
              canUpgrade={canUpgrade}
            />
          </ButtonWrapper>
        ) : (
          <UnavailableServiceMessage
            className="unavailable-upgrade-message"
            message={{
              description:
                'Ikke mulig å deploye nåværende eller annen versjon.',
              reason: 'Manglende admin rettigheter.'
            }}
          />
        )}
      </div>
      <div className="g-action-bar">
        <TextField label="Søk etter versjon" onChanged={handleVersionSearch} />
        <Button
          buttonType="primaryRounded"
          onClick={handlefetchTags}
          disabled={!tagsPaged.hasNextPage}
          style={{
            minWidth: '160px'
          }}
        >
          {isFetchingTags ? <Spinner /> : 'Hent flere tags'}
        </Button>
      </div>
      <div className="g-details-list">
        <TagsList
          tags={tagsPaged.tags}
          imageTagType={selectedTagType}
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
  grid-template-columns: 400px 1fr;
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
