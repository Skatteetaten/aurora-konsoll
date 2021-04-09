import React from 'react';

import { FetchVersionsInformation } from '../../components/FetchVersionsInformation';
import {
  IFetchMoreVersionsProps,
  FetchMoreVersionsState,
} from './FetchMoreVersions.state';
import LoadingButton from '../../../../../../../components/LoadingButton';

type Props = IFetchMoreVersionsProps & FetchMoreVersionsState;

export const FetchMoreVersions = ({
  versionType,
  searchText,
  repository,
  imageTagsConnection,
  fetchVersions,
  isFetching,
}: Props) => {
  return (
    <>
      <div style={{ textAlign: 'center' }}>
        <p>
          Viser {imageTagsConnection.currentVersionsSize()} av{' '}
          {imageTagsConnection.totalVersionsCount()} versjoner
        </p>
        <LoadingButton
          loading={isFetching}
          icon="History"
          onClick={() => {
            // Check for new tags
            fetchVersions(repository, versionType, 5, false, searchText);
            if (imageTagsConnection.hasNextPage()) {
              fetchVersions(repository, versionType, 100, true, searchText);
            }
          }}
          style={{
            minWidth: '225px',
          }}
        >
          Hent flere versjoner
        </LoadingButton>
        <div style={{ marginTop: '8px' }}>
          <FetchVersionsInformation />
        </div>
      </div>
    </>
  );
};
