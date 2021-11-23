import { connect } from 'react-redux';
import { DeploymentView } from './DeploymentView';
import { RootState, ReduxProps } from 'web/store/types';

import {
  updateUserSettings,
  getUserSettings,
} from 'web/store/state/userSettings/action.creators';
import {
  fetchApplicationDeployments,
  refreshAllDeploymentsForAffiliation,
} from 'web/store/state/applicationDeployments/action.creators';

const mapDispatchToProps = {
  refreshAllDeploymentsForAffiliation,
  fetchApplicationDeployments,
  updateUserSettings,
  getUserSettings,
};

const mapStateToProps = ({ userSettings, applications }: RootState) => {
  const { applicationsConnection, isRefreshingForAffiliation, isFetching } =
    applications;
  return {
    isFetching,
    applicationsConnection,
    isRefreshingForAffiliation,
    userSettings: {
      applicationDeploymentFilters: userSettings.applicationDeploymentFilters,
    },
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
