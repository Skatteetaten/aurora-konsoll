import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import Button from 'aurora-frontend-react-komponenter/Button';
import Spinner from 'aurora-frontend-react-komponenter/Spinner';

import { ImageTagType } from 'models/ImageTagType';
import { RootState, ReduxProps } from 'store/types';
import { IImageTag } from 'services/auroraApiClients/imageRepositoryClient/query';

import { FetchVersionsInformation } from '../../components/FetchVersionsInformation';
import { fetchVersions } from 'store/state/versions/action.creators';
import { VersionTabel } from './VersionTable';

const mapDispatchToProps = {
  fetchVersions
};
const mapStateToProps = ({ versions }: RootState, { versionType }: Props) => ({
  versions,
  isFetching: versions.isFetching[versionType]
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
  currentVersion: IImageTag;
};

const VersionTableContainerBase = ({
  affiliation,
  versionType,
  searchText,
  repository,
  fetchVersions,
  versions,
  applicationId,
  currentVersion,
  isFetching
}: Props & VersionProps) => {
  const current = versions.types[versionType];
  const index = current.edges.findIndex(
    edge => edge.node.name === currentVersion.name
  );

  useEffect(() => {
    if (index === -1 && !isFetching && versionType === currentVersion.type) {
      fetchVersions(repository, versionType, 100, true, searchText);
    }
  }, [
    currentVersion.type,
    fetchVersions,
    index,
    isFetching,
    repository,
    searchText,
    versionType
  ]);

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
          disabled={isFetching}
          onClick={() => {
            // Check for new tags
            fetchVersions(repository, versionType, 5, false, searchText);
            if (current.hasNextPage()) {
              fetchVersions(repository, versionType, 100, true, searchText);
            }
          }}
        >
          {isFetching ? <Spinner /> : 'Hent flere versjoner'}
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
