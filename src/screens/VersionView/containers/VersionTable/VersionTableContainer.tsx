import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import Button from 'aurora-frontend-react-komponenter/Button';
import Spinner from 'aurora-frontend-react-komponenter/Spinner';

import { ImageTagType } from 'models/ImageTagType';
import { RootState, ReduxProps } from 'store/types';

import { fetchVersions, reset } from 'store/state/versions/action.creators';
import { VersionTabel } from './VersionTable';
import { FetchVersionsInformation } from 'screens/VersionView/components/FetchVersionsInformation';

const mapDispatchToProps = {
  fetchVersions,
  reset
};
const mapStateToProps = ({ versions }: RootState) => ({
  versions
});

type VersionProps = ReduxProps<
  typeof mapDispatchToProps,
  typeof mapStateToProps
>;

type Props = {
  versionType: ImageTagType;
  searchText?: string;
  repository: string;
  applicationId: string;
  currentVersion: string;
};

const VersionTableContainerBase = ({
  versionType,
  searchText,
  repository,
  fetchVersions,
  versions,
  applicationId,
  currentVersion,
  reset
}: Props & VersionProps) => {
  // TODO: Move higher
  useEffect(() => {
    reset();
    fetchVersions(repository, ImageTagType.MAJOR, 15);
    fetchVersions(repository, ImageTagType.MINOR, 15);
    fetchVersions(repository, ImageTagType.BUGFIX, 15);
    fetchVersions(repository, ImageTagType.SNAPSHOT, 15);
    fetchVersions(repository, ImageTagType.LATEST, 1);
    fetchVersions(repository, ImageTagType.COMMIT_HASH, 15);
    fetchVersions(repository, ImageTagType.AURORA_VERSION, 15);
    fetchVersions(repository, ImageTagType.AURORA_SNAPSHOT_VERSION, 15);
  }, [fetchVersions, repository, reset]);

  const current = versions.types[versionType];

  return (
    <>
      <VersionTabel
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
