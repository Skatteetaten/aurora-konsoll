import * as React from 'react';

import DetailsList from 'aurora-frontend-react-komponenter/DetailsList';

import { Selection } from 'office-ui-fabric-react/lib/DetailsList';

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
  currentDeployedTag: string;
  handleSelectNextTag: (item: ITag) => void;
}

export default class TagsList extends React.Component<ITagsListProps> {
  private selection = new Selection();

  public componentDidUpdate(prevProps: ITagsListProps) {
    const { tags, currentDeployedTag } = this.props;

    if (prevProps.tags.length > 0) {
      // this.selection.getSelection().forEach(k => {
      //   const tag = k as ITag;
      //   // tslint:disable-next-line:no-console
      //   console.log(this.selection.isKeySelected(tag.name));
      //   this.selection.setKeySelected(tag.name, false, false);
      // });
      this.selection.setAllSelected(false);
    }

    if (tags.length > 0) {
      const index = tags.findIndex(t => t.name === currentDeployedTag);
      if (index !== -1) {
        this.selection.setIndexSelected(index, true, true);
      }
    }
  }

  public componentDidMount() {
    // tslint:disable-next-line:no-console
    console.log(this.props.tags);
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
        selectionMode={DetailsList.SelectionMode.none}
      />
    );
  }
}
