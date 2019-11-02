import { connect } from 'react-redux';
import { DeploymentView } from './DeploymentView';
import { RootState, ReduxProps } from 'store/types';
import { refreshAffiliations } from '../state/actions';

import {
  updateUserSettings,
  getUserSettings
} from 'store/state/userSettings/action.creators';
import { fetchApplicationDeployments } from 'store/state/applicationDeployments/action.creators';

const mapDispatchToProps = {
  refreshAffiliations,
  fetchApplicationDeployments,
  updateUserSettings,
  getUserSettings
};

const mapStateToProps = ({
  affiliationView,
  userSettings,
  applications
}: RootState) => {
  const { isRefreshingAffiliations } = affiliationView;
  const { applicationsConnection } = applications;
  return {
    applicationsConnection,
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
