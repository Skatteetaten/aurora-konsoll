import Button from 'aurora-frontend-react-komponenter/Button';
import Spinner from 'aurora-frontend-react-komponenter/Spinner';
import * as React from 'react';
import { ITagsPaged } from 'services/AuroraApiClient/types';

interface IVersionsProps {
  tagsLoading: boolean;
  tagsPaged?: ITagsPaged;
  previousCursor: string;
  handleFetchTags: (cursor: string) => void;
}

const Versions = ({
  tagsPaged,
  tagsLoading,
  previousCursor,
  handleFetchTags
}: IVersionsProps) => {
  if (tagsLoading) {
    return <Spinner />;
  }

  if (!tagsPaged) {
    return <p>No versions available</p>;
  }

  const fetchMoreTags = (cursor: string) => () => handleFetchTags(cursor);

  return (
    <div>
      <Button
        buttonType="primary"
        onClick={fetchMoreTags(previousCursor)}
        disabled={!tagsPaged.hasPreviousPage}
      >
        Previous page
      </Button>
      <Button
        buttonType="primary"
        onClick={fetchMoreTags(tagsPaged.endCursor)}
        disabled={!tagsPaged.hasNextPage}
      >
        Next page
      </Button>
      <ul>
        {tagsPaged.tags
          .sort((t1, t2) => {
            return t2.name.localeCompare(t1.name);
          })
          .map(tag => (
            <li key={tag.name}>
              {tag.name}{' '}
              <small>
                {new Date(tag.lastModified).toLocaleString('nb-NO')}
              </small>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default Versions;
