import Button from 'aurora-frontend-react-komponenter/Button';
import DetailsList from 'aurora-frontend-react-komponenter/DetailsList';
import Grid from 'aurora-frontend-react-komponenter/Grid';
import Spinner from 'aurora-frontend-react-komponenter/Spinner';
import * as React from 'react';
import { ITagsPaged } from 'services/AuroraApiClient/types';

interface IVersionsProps {
  tagsLoading: boolean;
  tagsPaged?: ITagsPaged;
  handleFetchTags: (cursor: string) => void;
}

const detailListColumns = [
  {
    fieldName: 'name',
    isResizable: true,
    key: 'name',
    maxWidth: 400,
    minWidth: 50,
    name: 'Name'
  },
  {
    fieldName: 'lastModified',
    isResizable: true,
    key: 'lastModified',
    maxWidth: 200,
    minWidth: 50,
    name: 'Last modified'
  }
];

const Versions = ({
  tagsPaged,
  tagsLoading,
  handleFetchTags
}: IVersionsProps) => {
  if (tagsLoading && !tagsPaged) {
    return <Spinner />;
  }

  if (!tagsPaged) {
    return <p>No versions available</p>;
  }

  const fetchMoreTags = (cursor: string) => () => handleFetchTags(cursor);
  const tagsItem = tagsPaged.tags
    .sort((t1, t2) => {
      const date1 = new Date(t1.lastModified).getTime();
      const date2 = new Date(t2.lastModified).getTime();

      if (date2 > date1) {
        return 1;
      }
      if (date1 < date2) {
        return -1;
      }

      return 0;
    })
    .map(tag => ({
      lastModified: new Date(tag.lastModified).toLocaleString('nb-NO'),
      name: tag.name
    }));
  return (
    <Grid>
      <Grid.Row>
        <Grid.Col lg={6}>
          <Button
            buttonType="primary"
            onClick={fetchMoreTags(tagsPaged.endCursor)}
            disabled={!tagsPaged.hasNextPage}
          >
            {tagsLoading ? <Spinner /> : 'Load more'}
          </Button>
          <DetailsList columns={detailListColumns} items={tagsItem} />
        </Grid.Col>
      </Grid.Row>
    </Grid>
  );
};

export default Versions;
