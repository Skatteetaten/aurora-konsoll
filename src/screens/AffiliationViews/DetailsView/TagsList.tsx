import * as React from 'react';

import DetailsList from 'aurora-frontend-react-komponenter/DetailsList';

import { Selection } from 'office-ui-fabric-react/lib/DetailsList';

import { ImageTagType } from 'models/TagsPagedGroup';
import { ITag } from 'services/auroraApiClients';
import styled from 'styled-components';

const detailListColumns = [
  {
    fieldName: 'name',
    isResizable: true,
    key: 'name',
    maxWidth: 400,
    minWidth: 100,
    name: 'Navn'
  },
  {
    fieldName: 'lastModified',
    isResizable: true,
    key: 'lastModified',
    maxWidth: 200,
    minWidth: 100,
    name: 'Sist endret'
  }
];

interface ITagsListProps {
  tags: ITag[];
  imageTagType: ImageTagType;
  currentDeployedTag: string;
  handleSelectNextTag: (item?: ITag) => void;
}

interface ITagsListState {
  selectedTag: string;
  deployedTagIndex: number;
  selectedTagIndex: number;
}

export default class TagsList extends React.Component<
  ITagsListProps,
  ITagsListState
> {
  public state: ITagsListState = {
    deployedTagIndex: -1,
    selectedTag: '',
    selectedTagIndex: -1
  };

  private selection = new Selection();

  public updateSelection = (
    tags: ITag[],
    currentDeployedTag: string,
    reset: boolean
  ) => {
    const { selectedTag } = this.state;
    const deployedTagIndex = tags.findIndex(t => t.name === currentDeployedTag);
    const selectedTagIndex = tags.findIndex(t => t.name === selectedTag);

    this.setState({
      deployedTagIndex,
      selectedTagIndex
    });

    if (reset) {
      this.selection.setAllSelected(false);
    }

    if (selectedTagIndex !== -1) {
      this.selection.setIndexSelected(selectedTagIndex, true, true);
    } else if (deployedTagIndex !== -1) {
      this.selection.setIndexSelected(deployedTagIndex, true, true);
    }
  };

  public handleSelectedTag = (tag: ITag) => {
    const selectedTagIndex = this.props.tags.findIndex(
      t => t.name === tag.name
    );
    this.setState({
      selectedTag: tag.name,
      selectedTagIndex
    });
    this.props.handleSelectNextTag(tag);
  };

  public componentDidUpdate(prevProps: ITagsListProps) {
    const { tags, imageTagType, currentDeployedTag } = this.props;

    const differentTagType = prevProps.imageTagType !== imageTagType;
    const newTags = tags.length !== prevProps.tags.length;

    if (differentTagType || newTags) {
      this.updateSelection(tags, currentDeployedTag, true);
    }
  }

  public componentDidMount() {
    const { tags, currentDeployedTag } = this.props;
    if (tags.length > 0) {
      setTimeout(() => {
        this.updateSelection(tags, currentDeployedTag, false);
      }, 100);
    }
  }

  public render() {
    const { deployedTagIndex, selectedTagIndex } = this.state;
    const { tags } = this.props;

    return (
      <DetailsListWrapper
        deployedIndex={deployedTagIndex}
        selectedIndex={selectedTagIndex}
      >
        <DetailsList
          columns={detailListColumns}
          items={tags}
          setKey="name"
          selection={this.selection}
          onActiveItemChanged={this.handleSelectedTag}
          selectionPreservedOnEmptyClick={true}
          selectionMode={DetailsList.SelectionMode.single}
        />
      </DetailsListWrapper>
    );
  }
}

const DetailsListWrapper = styled.div<{
  deployedIndex: number;
  selectedIndex: number;
}>`
  [data-item-index] {
    &:hover, &:active, &:focus {
    color: black;
      background: #cde1f9;
    }
  }

  [data-item-index="${props => props.selectedIndex}"] {
    background: #8accff;

    &:hover, &:active, &:focus {
      background: #8accff;
    }
  }

  [data-item-index="${props => props.deployedIndex}"] {
    background: ${({ deployedIndex, selectedIndex }) =>
      deployedIndex === selectedIndex ? '#e7b78a' : '#f9ede2'};

    &:hover, &:active, &:focus {
      background: #e7b78a;
    }
  }

  .ms-List-cell {
    cursor: pointer
  }
`;
