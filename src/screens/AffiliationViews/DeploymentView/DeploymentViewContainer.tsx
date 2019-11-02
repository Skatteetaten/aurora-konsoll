import { connect } from 'react-redux';
import { DeploymentView } from './DeploymentView';
import { RootState, ReduxProps } from 'store/types';

import {
  updateUserSettings,
  getUserSettings
} from 'store/state/userSettings/action.creators';
import {
  fetchApplicationDeployments,
  refreshAllDeploymentsForAffiliation
} from 'store/state/applicationDeployments/action.creators';

const mapDispatchToProps = {
  refreshAllDeploymentsForAffiliation,
  fetchApplicationDeployments,
  updateUserSettings,
  getUserSettings
};

const mapStateToProps = ({ userSettings, applications }: RootState) => {
  const { applicationsConnection, isRefreshingForAffiliation } = applications;
  return {
    applicationsConnection,
    isRefreshingForAffiliation,
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
