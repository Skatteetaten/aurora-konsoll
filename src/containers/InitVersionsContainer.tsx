import React, { useEffect } from 'react';
import {
  resetState,
  fetchVersions
} from 'store/state/versions/action.creators';
import { connect, ResolveThunks } from 'react-redux';
import { ImageTagType } from 'models/ImageTagType';
import { IImageRepository } from 'services/auroraApiClients/applicationDeploymentClient/query';

const mapDispatchToProps = {
  resetState,
  fetchVersions
};

interface InitVersionsProps {
  hasPermission: boolean;
  imageRepository?: IImageRepository;
}

type Props = ResolveThunks<typeof mapDispatchToProps> & InitVersionsProps;

// TODO: Move to redux action creator when deployment is available in state.
const InitVersions = ({
  imageRepository,
  fetchVersions,
  resetState,
  hasPermission
}: Props) => {
  useEffect(() => {
    resetState();
    if (!imageRepository || !hasPermission) {
      return;
    }
    const { repository } = imageRepository;
    fetchVersions(repository, ImageTagType.MAJOR, 15);
    fetchVersions(repository, ImageTagType.MINOR, 15);
    fetchVersions(repository, ImageTagType.BUGFIX, 15);
    fetchVersions(repository, ImageTagType.SNAPSHOT, 15);
    fetchVersions(repository, ImageTagType.LATEST, 1);
    fetchVersions(repository, ImageTagType.COMMIT_HASH, 15);
    fetchVersions(repository, ImageTagType.AURORA_VERSION, 15);
    fetchVersions(repository, ImageTagType.AURORA_SNAPSHOT_VERSION, 15);
  }, [fetchVersions, hasPermission, imageRepository, resetState]);

  return <React.Fragment />;
};

export const InitVersionsContainer = connect(
  () => ({}),
  mapDispatchToProps
)(InitVersions);
