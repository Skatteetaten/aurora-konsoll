import React, { useEffect } from 'react';
import {
  resetState,
  fetchVersions
} from 'web/store/state/versions/action.creators';
import { connect, ResolveThunks } from 'react-redux';
import { IImageRepository } from 'web/services/auroraApiClients/applicationDeploymentClient/query';

const mapDispatchToProps = {
  resetState,
  fetchVersions
};

interface InitVersionsProps {
  hasPermission: boolean;
  imageRepository?: IImageRepository;
}

type Props = ResolveThunks<typeof mapDispatchToProps> & InitVersionsProps;

const Versions = ({
  imageRepository,
  fetchVersions,
  resetState,
  hasPermission
}: Props) => {
  const repository = imageRepository && imageRepository.repository;
  useEffect(() => {
    if (!repository || !hasPermission) {
      return;
    }
    resetState();
    fetchVersions(repository);
    return () => {
      resetState();
    };
  }, [hasPermission, repository, resetState, fetchVersions]);

  return <React.Fragment />;
};

export const VersionsContainer = connect(
  undefined,
  mapDispatchToProps
)(Versions);
