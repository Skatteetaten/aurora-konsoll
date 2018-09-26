import * as React from 'react';
import styled from 'styled-components';

import DetailsList from 'aurora-frontend-react-komponenter/DetailsList';
import { Selection } from 'office-ui-fabric-react/lib/DetailsList';

import { ITag } from 'services/auroraApiClients';
import { ImageTagType } from 'services/TagsPagedGroup';

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
  deployedTag: ITag;
  selectedTag?: ITag;
  handleSelectNextTag: (item?: ITag) => void;
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

  private selection = new Selection();

  public resetSelections = () => {
    this.selection.setAllSelected(false);
  };

  public updateSelection = () => {
    const { tags, deployedTag, selectedTag } = this.props;

    const deployedTagIndex = tags.findIndex(t => t.name === deployedTag.name);
    const selectedTagIndex = tags.findIndex(
      t => !!selectedTag && t.name === selectedTag.name
    );

    this.setState({
      deployedTagIndex,
      selectedTagIndex
    });

    if (selectedTagIndex !== -1) {
      this.selection.setIndexSelected(selectedTagIndex, true, true);
    }
    if (deployedTagIndex !== -1) {
      this.selection.setIndexSelected(deployedTagIndex, true, true);
    }
  };

  public handleSelectedTag = (tag: ITag) => {
    const selectedTagIndex = this.props.tags.findIndex(
      t => t.name === tag.name
    );
    this.setState({
      selectedTagIndex
    });
    this.props.handleSelectNextTag(tag);
  };

  public componentDidUpdate(prevProps: ITagsListProps) {
    const { tags, imageTagType } = this.props;

    const differentTagType = prevProps.imageTagType !== imageTagType;
    const newTags = tags.length !== prevProps.tags.length;
    const differentSelectedTag =
      prevProps.selectedTag !== this.props.selectedTag;

    if (differentTagType || newTags || differentSelectedTag) {
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
    color: black;
    background: #8accff;

    &:hover, &:active, &:focus {
      background: #8accff;
    }
  }

  [data-item-index="${props => props.deployedIndex}"] {
    color: black;
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
