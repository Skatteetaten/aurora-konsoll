import React from 'react';
import Button from '@skatteetaten/frontend-components/Button';
import Spinner from '@skatteetaten/frontend-components/Spinner';

import { FetchVersionsInformation } from '../../components/FetchVersionsInformation';
import {
  IFetchMoreVersionsProps,
  FetchMoreVersionsState,
} from './FetchMoreVersions.state';

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
        <Button
          icon="History"
          buttonStyle="primaryRoundedFilled"
          disabled={isFetching}
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
          {isFetching ? (
            <Spinner size={Spinner.Size && Spinner.Size['large']} />
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
