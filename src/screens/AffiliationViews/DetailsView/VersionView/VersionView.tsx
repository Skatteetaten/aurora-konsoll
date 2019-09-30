import * as React from 'react';
import { useEffect, useState } from 'react';
import styled from 'styled-components';

import Button from 'aurora-frontend-react-komponenter/Button';
import TextField from 'aurora-frontend-react-komponenter/TextField';
import Callout from 'aurora-frontend-react-komponenter/Callout';

import Spinner from 'components/Spinner';
import CalloutButton from 'components/CalloutButton';
import { ImageTagType } from 'models/ImageTagType';
import { ITag, ITagsPaged, ITagsPagedGroup } from 'models/Tag';

import UnavailableServiceMessage from 'components/UnavailableServiceMessage';
import { IUnavailableServiceMessage } from 'models/UnavailableServiceMessage';
import TagsList from './TagsList';
import TagTypeSelector, {
  IImageTagTypeOption
} from './TagTypeSelector/TagTypeSelector';
import MessageBar from 'aurora-frontend-react-komponenter/MessageBar';
import { ITextField } from 'office-ui-fabric-react';

interface IVersionViewProps {
  hasPermissionToUpgrade: boolean;
  isFetchingTags: boolean;
  isFetchingGroupedTags: boolean;
  isRedeploying: boolean;
  initialTagType: string;
  unavailableMessage?: IUnavailableServiceMessage;
  selectedTagType: ImageTagType;
  tagsPaged: ITagsPaged;
  deployedTag: ITag;
  selectedTag?: ITag;
  className?: string;
  findGroupedTagsPagedResult: ITagsPagedGroup;
  versionSearchText: string;
  canUpgrade: (selectedTag?: ITag) => boolean;
  handlefetchTags: () => void;
  handleSelectStrategy: (e: Event, option: IImageTagTypeOption) => void;
  handleVersionSearch: (value: string) => void;
  redeployWithVersion: (version?: ITag) => void;
  redeployWithCurrentVersion: () => void;
  handleSelectNextTag: (item?: ITag) => void;
  searchForVersions: () => void;
}

interface IVersionViewState {
  searchRef?: ITextField;
}

const ENTER_KEY = 13;

const VersionView = ({
  tagsPaged,
  isFetchingTags,
  isFetchingGroupedTags,
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
  versionSearchText,
  searchForVersions
}: IVersionViewProps) => {
  const [state, setState] = useState<IVersionViewState>({
    searchRef: undefined
  });
  useEffect(() => {
    if (state.searchRef) {
      state.searchRef.focus();
    }
  }, [state.searchRef]);

  if (unavailableMessage) {
    return <UnavailableServiceMessage message={unavailableMessage} />;
  }

  const searchOnEnterPress = (e: React.KeyboardEvent<InputEvent>) => {
    if (
      e.charCode === ENTER_KEY &&
      (!isFetchingTags || !isFetchingGroupedTags)
    ) {
      if (versionSearchText !== '') {
        searchForVersions();
      }
    }
  };

  const loadMoreTagsMessage = () => {
    if (!tagsPaged.hasNextPage) {
      return 'Søk etter nye';
    }
    return 'Last inn 100 flere';
  };

  return (
    <div className={className}>
      {!isFetchingGroupedTags ? (
        <>
          {hasPermissionToUpgrade ? null : (
            <MessageBar>
              Ikke mulig å deploye nåværende eller annen versjon. Årsak: Mangler
              admin rettigheter.
            </MessageBar>
          )}
          <div className="action-bar">
            <TagTypeSelector
              imageTagType={selectedTagType}
              handleSelectStrategy={handleSelectStrategy}
              findGroupedTagsPagedResult={findGroupedTagsPagedResult}
            />
            <div style={{ width: 300, marginLeft: 20, marginRight: 6 }}>
              <TextField
                componentRef={value => {
                  if (!state.searchRef) {
                    setState({ searchRef: value });
                  }
                }}
                placeholder="Søk etter versjon"
                onChange={(_e, value) => handleVersionSearch(value)}
                value={versionSearchText}
                iconProps={{ iconName: 'Search' }}
                onKeyPress={searchOnEnterPress}
              />
            </div>
          </div>
          <span style={{ marginBottom: '5px' }}>
            <MessageBar type={MessageBar.Type.info}>
              Listen kan være mangelfull. Gjør et søk eller last inn flere
              versjoner.
            </MessageBar>
          </span>
          <div className="details-list">
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
            <div>{`Viser ${tagsPaged.tags.length} av ${tagsPaged.totalCount} tags`}</div>
            <div>
              <Button
                icon="History"
                buttonType="primaryRoundedFilled"
                onClick={handlefetchTags}
                disabled={
                  isFetchingTags ||
                  isFetchingGroupedTags ||
                  (selectedTagType === ImageTagType.SEARCH &&
                    !tagsPaged.hasNextPage)
                }
                style={{
                  minWidth: '195px'
                }}
              >
                {isFetchingTags || isFetchingGroupedTags ? (
                  <Spinner />
                ) : (
                  loadMoreTagsMessage()
                )}
              </Button>
              <div className="callout-button">
                <CalloutButton
                  calloutProps={{
                    color: Callout.INFO,
                    gapSpace: 8,
                    directionalHint: Callout.POS_BOTTOM_CENTER
                  }}
                  buttonProps={{
                    icon: 'info',
                    buttonType: 'secondary'
                  }}
                  title="Vis info"
                  content={
                    <p>
                      Hver gang man laster inn tags så vil det alltid hentes de
                      nyeste tagene i tillegg.
                    </p>
                  }
                />
              </div>
            </div>
          </div>
        </>
      ) : (
        <Spinner />
      )}
    </div>
  );
};

export default styled(VersionView)`
  display: flex;
  flex-direction: column;
  height: 100%;
  margin: 0 16px;

  .action-bar {
    margin-bottom: 10px;
    display: flex;
    align-items: flex-end;
  }

  .details-list {
    overflow-x: hidden;
  }

  .tags-action {
    text-align: center;
    .callout-button {
      padding-top: 10px;
    }
  }

  .tags-action > div:first-child {
    margin: 20px 0 15px 0;
  }
`;
