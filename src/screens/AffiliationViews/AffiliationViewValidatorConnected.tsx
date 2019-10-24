import { connect } from 'react-redux';
import { RootState, ReduxProps } from 'store/types';
import { AffiliationViewValidator } from './AffiliationViewValidator';
import {
  findAllApplicationDeployments,
  refreshAffiliations
} from './state/actions';

import {
  getUserSettings,
  updateUserSettings
} from 'store/state/userSettings/action.creators';

const mapStateToProps = ({ affiliationView, startup }: RootState) => ({
  isFetchingAffiliations: affiliationView.isRefreshingAffiliations,
  allApplicationDeployments: affiliationView.allApplicationDeploymentsResult,
  isFetchingAllApplicationDeployments:
    affiliationView.isFetchingAllApplicationDeployments,
  currentUser: startup.currentUser,
  userSettings: affiliationView.userSettings
});

const mapDispatchToProps = {
  refreshAffiliations,
  findAllApplicationDeployments,
  getUserSettings,
  updateUserSettings
};

export type AffiliationViewValidatorState = ReduxProps<
  typeof mapDispatchToProps,
  typeof mapStateToProps
>;

export const AffiliationViewValidatorConnected = connect(
  mapStateToProps,
  mapDispatchToProps
)(AffiliationViewValidator);
