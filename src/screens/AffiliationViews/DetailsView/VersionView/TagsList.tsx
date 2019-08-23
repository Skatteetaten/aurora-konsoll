import * as React from 'react';
import styled from 'styled-components';

import DetailsList from 'aurora-frontend-react-komponenter/DetailsList';
import Table from 'aurora-frontend-react-komponenter/Table';
import Spinner from 'components/Spinner';

import { ImageTagType, findImageTagTypeLabel } from 'models/ImageTagType';
import { ITag, ITagWithDeployButton } from 'models/Tag';
import UpgradeButton from './UpgradeButton';

const detailListColumns = [
  {
    fieldName: 'type',
    isResizable: true,
    key: 'type',
    maxWidth: 150,
    minWidth: 100,
    name: 'Type deploy'
  },
  {
    fieldName: 'name',
    isResizable: true,
    key: 'name',
    maxWidth: 550,
    minWidth: 100,
    name: 'Navn'
  },
  {
    fieldName: 'lastModified',
    isResizable: true,
    key: 'lastModified',
    maxWidth: 250,
    minWidth: 150,
    name: 'Sist endret'
  },
  {
    fieldName: 'deploy',
    isResizable: true,
    key: 'deploy',
    maxWidth: 200,
    minWidth: 100,
    name: ''
  }
];

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

export default class TagsList extends React.Component<
  ITagsListProps,
  ITagsListState
> {
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

  public renderItemColoumn = (item?: any, index?: number, column?: any) => {
    if (column && column.fieldName) {
      return (
        <ColumnItem title={item[column.fieldName]}>
          {item[column.fieldName]}
        </ColumnItem>
      );
    }
    return null;
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

    const tagsWithDeployButton = (): ITagWithDeployButton[] =>
      tags.map(it => {
        return {
          type: findImageTagTypeLabel(it.type),
          name: it.name,
          lastModified: it.lastModified,
          deploy: deployButton(it)
        };
      });

    return (
      <DetailsListWrapper
        deployedIndex={deployedTagIndex}
        selectedIndex={selectedTagIndex}
        style={{ backgroundColor: 'white' }}
      >
        <Table data={tagsWithDeployButton()} columns={detailListColumns} />
      </DetailsListWrapper>
    );
  }
}

// Removed padding from .ms-DetailsRow-cell and applied it to this component
// to make the whole cell show title
const ColumnItem = styled.p`
  margin: 0;
  padding: 11px 8px;
`;

interface IDetailsListWrapper {
  deployedIndex: number;
  selectedIndex: number;
}

const DetailsListWrapper = styled.div<IDetailsListWrapper>`
  table {
    th:nth-child(1){
      width: 200px
    }
    th:nth-child(2){
      width: 800px
    }
    th:nth-child(3){
      width: 300px
    }
  }


  .ms-FocusZone.ms-DetailsRow {
    &[data-item-index] {
      &:hover, &:active, &:focus {
        color: black;
        background: #cde1f9;
      }
    }

    &[data-item-index="${props => props.selectedIndex}"] {
      color: black;
      background: #8accff ;

      &:hover, &:active, &:focus {
        background: #8accff;
      }
    }

    &[data-item-index="${props => props.deployedIndex}"] {
      color: black;
      background: ${({ deployedIndex, selectedIndex }) =>
        deployedIndex === selectedIndex ? '#e7b78a' : '#f9ede2'};

      &:hover, &:active, &:focus {
        background: #e7b78a;
      }
    }
  }
  .ms-List-cell {
    cursor: pointer
  }

  .ms-DetailsRow-cell {
    padding: 0;
  }`;
