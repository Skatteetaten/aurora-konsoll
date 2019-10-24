import { connect } from 'react-redux';
import { DeploymentView } from './DeploymentView';
import { RootState, ReduxProps } from 'store/types';
import {
  refreshAffiliations,
  findAllApplicationDeployments
} from '../state/actions';

import {
  updateUserSettings,
  getUserSettings
} from 'store/state/userSettings/action.creators';

const mapDispatchToProps = {
  refreshAffiliations,
  findAllApplicationDeployments,
  updateUserSettings,
  getUserSettings
};

const mapStateToProps = ({ affiliationView, userSettings }: RootState) => {
  const {
    isRefreshingAffiliations,
    allApplicationDeploymentsResult,
    isFetchingAllApplicationDeployments
  } = affiliationView;
  return {
    allApplicationDeploymentsResult,
    isFetchingAllApplicationDeployments,
    isRefreshingAffiliations,
    userSettings: {
      applicationDeploymentFilters: userSettings.applicationDeploymentFilters
    }
  };
};

export type DeploymentViewContainerState = ReduxProps<
  typeof mapDispatchToProps,
  typeof mapStateToProps
>;

export const DeploymentViewContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(DeploymentView);
