import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import Button from 'aurora-frontend-react-komponenter/Button';
import Spinner from 'aurora-frontend-react-komponenter/Spinner';

import { ImageTagType } from 'models/ImageTagType';
import { RootState, ReduxProps } from 'store/types';

import { fetchVersions, reset } from '../../../../store/state/versions/actions';
import { VersionTabel } from './VersionTable';

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
  repository: string;
  applicationId: string;
};

const VersionTableContainerBase = ({
  versionType,
  repository,
  fetchVersions,
  versions,
  applicationId,
  reset
}: Props & VersionProps) => {
  // Move higher
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
        versions={current.getTags()}
      />
      <p>
        Viser {current.edges.length} av {current.totalCount} versjoner
      </p>
      <Button
        disabled={versions.isLoading}
        onClick={() => {
          // Check for new tags
          fetchVersions(repository, versionType, 5, false);
          if (current.hasNextPage()) {
            fetchVersions(repository, versionType);
          }
        }}
      >
        {versions.isLoading ? <Spinner /> : 'Hent flere versjoner'}
      </Button>
    </>
  );
};

export const VersionTableContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(VersionTableContainerBase);
