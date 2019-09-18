import * as React from 'react';
import styled from 'styled-components';

import DetailsList from 'aurora-frontend-react-komponenter/DetailsList';
import Table from 'aurora-frontend-react-komponenter/Table';

import { ImageTagType } from 'models/ImageTagType';
import { ITag } from 'models/Tag';
import UpgradeButton from './UpgradeButton';
import { getOptionName } from './TagTypeSelector/TagTypeSelector';

const detailListColumns = [
  {
    fieldName: 'type',
    key: 'type',
    name: 'Versjonstype'
  },
  {
    fieldName: 'name',
    key: 'name',
    name: 'Navn'
  },
  {
    fieldName: 'lastModified',
    key: 'lastModified',
    name: 'Sist endret'
  },
  {
    fieldName: 'deploy',
    key: 'deploy',
    name: ''
  }
];

interface ITagTable {
  deploy: JSX.Element;
  name: string;
  type: string;
  lastModified: string;
}

interface ITagsListProps {
  tags: ITag[];
  imageTagType: ImageTagType;
  deployedTag: ITag;
  selectedTag?: ITag;
  initialTagType: string;
  isRedeploying: boolean;
  versionSearchText: string;
  hasPermissionToUpgrade: boolean;
  handlefetchTags: () => void;
  handleSelectNextTag: (item?: ITag) => void;
  canUpgrade: (selectedTag?: ITag) => boolean;
  redeployWithCurrentVersion: () => void;
  redeployWithVersion: (version?: ITag) => void;
}

interface ITagsListState {
  deployedTagIndex: number;
  selectedTagIndex: number;
}

class TagsList extends React.Component<ITagsListProps, ITagsListState> {
  public state: ITagsListState = {
    deployedTagIndex: -1,
    selectedTagIndex: -1
  };

  private selection = new DetailsList.Selection();

  public resetSelections = () => {
    this.selection.setAllSelected(false);
  };

  public updateSelection = () => {
    const {
      tags,
      deployedTag,
      selectedTag,
      initialTagType,
      imageTagType,
      handlefetchTags,
      versionSearchText
    } = this.props;

    const deployedTagIndex = tags.findIndex(t => t.name === deployedTag.name);
    const selectedTagIndex = tags.findIndex(
      t => !!selectedTag && t.name === selectedTag.name
    );

    this.setState({
      deployedTagIndex,
      selectedTagIndex
    });

    if (deployedTagIndex !== -1) {
      this.selection.setIndexSelected(deployedTagIndex, true, true);
    } else if (imageTagType === initialTagType && !!!versionSearchText) {
      handlefetchTags();
    }
  };

  public componentDidUpdate(prevProps: ITagsListProps) {
    const {
      tags,
      imageTagType,
      deployedTag,
      selectedTag,
      handleSelectNextTag
    } = this.props;

    const diffTagType = prevProps.imageTagType !== imageTagType;
    const newTags = tags.length !== prevProps.tags.length;
    const diffSelectedTag = prevProps.selectedTag !== selectedTag;
    const diffDeployTag = prevProps.deployedTag.name !== deployedTag.name;

    if (diffTagType) {
      handleSelectNextTag(undefined);
    }

    if (diffTagType || newTags || diffSelectedTag || diffDeployTag) {
      this.resetSelections();
      this.updateSelection();
    }
  }

  public componentDidMount() {
    if (this.props.tags.length > 0) {
      this.updateSelection();
    }
  }

  public render() {
    const { deployedTagIndex, selectedTagIndex } = this.state;
    const {
      tags,
      handleSelectNextTag,
      canUpgrade,
      redeployWithCurrentVersion,
      redeployWithVersion,
      isRedeploying,
      deployedTag,
      selectedTag,
      hasPermissionToUpgrade
    } = this.props;

    const deployButton = (tag: ITag) => (
      <UpgradeButton
        previousVersion={deployedTag.name}
        tag={tag}
        selectedTag={selectedTag}
        handleSelectNextTag={handleSelectNextTag}
        isRedeploying={isRedeploying}
        redeployWithVersion={redeployWithVersion}
        redeployWithCurrentVersion={redeployWithCurrentVersion}
        canUpgrade={canUpgrade}
        hasPermissionToUpgrade={hasPermissionToUpgrade}
      />
    );

    const tableTags = (): ITagTable[] =>
      tags.map(it => {
        return {
          type: getOptionName(it.type),
          name: it.name,
          lastModified: it.lastModified,
          deploy: deployButton(it)
        };
      });

    return (
      <DetailsListWrapper
        deployedIndex={deployedTagIndex}
        selectedIndex={selectedTagIndex}
      >
        <Table data={tableTags()} columns={detailListColumns} />
      </DetailsListWrapper>
    );
  }
}

interface IDetailsListWrapper {
  deployedIndex: number;
  selectedIndex: number;
}

const DetailsListWrapper = styled.div<IDetailsListWrapper>`
  table {
    background-color: white;
    width: 100%;
    th:nth-child(1) {
      width: 15%;
    }
    th:nth-child(2) {
      width: 65%;
    }
    th:nth-child(3) {
      width: 20%;
    }
  }

  button.ms-Button.ms-Button--action.ms-Button--command {
    height: 100%;
  }

  .ms-List-cell {
    cursor: pointer;
  }
`;

export default TagsList;
