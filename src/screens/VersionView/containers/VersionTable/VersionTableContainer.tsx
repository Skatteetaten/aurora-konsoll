import React from 'react';
import { connect } from 'react-redux';
import Button from 'aurora-frontend-react-komponenter/Button';
import Spinner from 'aurora-frontend-react-komponenter/Spinner';

import { ImageTagType } from 'models/ImageTagType';
import { RootState, ReduxProps } from 'store/types';

import { fetchVersions } from 'store/state/versions/action.creators';
import { VersionTabel } from './VersionTable';
import { FetchVersionsInformation } from 'screens/VersionView/components/FetchVersionsInformation';

const mapDispatchToProps = {
  fetchVersions
};
const mapStateToProps = ({ versions }: RootState) => ({
  versions
});

type VersionProps = ReduxProps<
  typeof mapDispatchToProps,
  typeof mapStateToProps
>;

type Props = {
  affiliation: string;
  versionType: ImageTagType;
  searchText?: string;
  repository: string;
  applicationId: string;
  currentVersion: string;
};

const VersionTableContainerBase = ({
  affiliation,
  versionType,
  searchText,
  repository,
  fetchVersions,
  versions,
  applicationId,
  currentVersion
}: Props & VersionProps) => {
  const current = versions.types[versionType];

  return (
    <>
      <VersionTabel
        affiliation={affiliation}
        applicationId={applicationId}
        currentVersion={currentVersion}
        versions={current.getTags()}
      />
      <div style={{ textAlign: 'center' }}>
        <p>
          Viser {current.edges.length} av {current.totalCount} versjoner
        </p>
        <Button
          icon="History"
          buttonType="primaryRoundedFilled"
          disabled={versions.isLoading}
          onClick={() => {
            // Check for new tags
            fetchVersions(repository, versionType, 5, false, searchText);
            if (current.hasNextPage()) {
              fetchVersions(repository, versionType, 100, true, searchText);
            }
          }}
        >
          {versions.isLoading ? <Spinner /> : 'Hent flere versjoner'}
        </Button>
        <div style={{ marginTop: '8px' }}>
          <FetchVersionsInformation />
        </div>
      </div>
    </>
  );
};

export const VersionTableContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(VersionTableContainerBase);
