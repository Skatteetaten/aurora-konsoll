import * as React from 'react';

import DetailsList from 'aurora-frontend-react-komponenter/DetailsList';

import { Selection } from 'office-ui-fabric-react/lib/DetailsList';

import { ImageTagType } from 'models/TagsPagedGroup';
import { ITag } from 'services/auroraApiClients';

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

export default class TagsList extends React.Component<ITagsListProps> {
  private selection = new Selection();

  public updateSelection = (
    tags: ITag[],
    currentDeployedTag: string,
    reset: boolean
  ) => {
    if (reset) {
      this.selection.setAllSelected(false);
      this.props.handleSelectNextTag(undefined);
    }
    const index = tags.findIndex(t => t.name === currentDeployedTag);
    if (index !== -1) {
      this.selection.setIndexSelected(index, true, true);
    }
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
    const { tags, handleSelectNextTag } = this.props;

    return (
      <DetailsList
        columns={detailListColumns}
        items={tags}
        setKey="name"
        selection={this.selection}
        onActiveItemChanged={handleSelectNextTag}
        selectionPreservedOnEmptyClick={true}
        selectionMode={DetailsList.SelectionMode.none}
      />
    );
  }
}
