import React from 'react';
import Button from 'aurora-frontend-react-komponenter/Button';
import Spinner from 'aurora-frontend-react-komponenter/Spinner';

import { FetchVersionsInformation } from '../../components/FetchVersionsInformation';
import {
  IFetchMoreVersionsProps,
  FetchMoreVersionsState
} from './FetchMoreVersions.state';

type Props = IFetchMoreVersionsProps & FetchMoreVersionsState;

export const FetchMoreVersions = ({
  versionType,
  searchText,
  repository,
  imageTagsConnection,
  fetchVersions,
  isFetching
}: Props) => {
  const { edges, totalCount } = imageTagsConnection;
  return (
    <>
      <div style={{ textAlign: 'center' }}>
        <p>
          Viser {edges.length} av {totalCount} versjoner
        </p>
        <Button
          icon="History"
          buttonType="primaryRoundedFilled"
          disabled={isFetching}
          onClick={() => {
            // Check for new tags
            fetchVersions(repository, versionType, 5, false, searchText);
            if (imageTagsConnection.hasNextPage()) {
              fetchVersions(repository, versionType, 100, true, searchText);
            }
          }}
          style={{
            minWidth: '225px'
          }}
        >
          {isFetching ? (
            <Spinner size={Spinner.Size.large} />
          ) : (
            'Hent flere versjoner'
          )}
        </Button>
        <div style={{ marginTop: '8px' }}>
          <FetchVersionsInformation />
        </div>
      </div>
    </>
  );
};
