import React, { useEffect } from 'react';
import {
  resetState,
  fetchInitVersions,
} from 'store/state/versions/action.creators';
import { connect, ResolveThunks } from 'react-redux';
import { IImageRepository } from 'services/auroraApiClients/applicationDeploymentClient/query';

const mapDispatchToProps = {
  resetState,
  fetchInitVersions,
};

interface InitVersionsProps {
  hasPermission: boolean;
  imageRepository?: IImageRepository;
}

type Props = ResolveThunks<typeof mapDispatchToProps> & InitVersionsProps;

const InitVersions = ({
  imageRepository,
  fetchInitVersions,
  resetState,
  hasPermission,
}: Props) => {
  const repository = imageRepository && imageRepository.repository;
  useEffect(() => {
    if (!repository || !hasPermission) {
      return;
    }
    fetchInitVersions(repository);
    return () => {
      resetState();
    };
  }, [hasPermission, repository, resetState, fetchInitVersions]);

  return <React.Fragment />;
};

export const InitVersionsContainer = connect(
  undefined,
  mapDispatchToProps
)(InitVersions);
