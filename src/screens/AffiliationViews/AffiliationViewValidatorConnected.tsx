import { addErrors, closeError } from 'models/StateManager/state/actions';
import { IUserSettings } from 'models/UserSettings';
import { connect } from 'react-redux';
import { RootState } from 'store/types';
import AffiliationViewValidator from './AffiliationViewValidator';
import {
  findAllApplicationDeployments,
  findApplicationDeploymentDetails,
  getUserSettings,
  refreshAffiliations,
  updateUserSettings
} from './state/actions';
import { IAffiliationViewState } from './state/reducer';

const getAffiliationsFetchingStatus = (state: IAffiliationViewState) =>
  state.isRefreshingAffiliations;

const getAllApplicationDeployments = (state: IAffiliationViewState) =>
  state.allApplicationDeploymentsResult;

const getAllApplicationDeploymentsStatus = (state: IAffiliationViewState) =>
  state.isFetchingAllApplicationDeployments;

const fetchUserSettings = (state: IAffiliationViewState) => state.userSettings;

const mapStateToProps = (state: RootState) => ({
  isFetchingAffiliations: getAffiliationsFetchingStatus(state.affiliationView),
  allApplicationDeployments: getAllApplicationDeployments(
    state.affiliationView
  ),
  isFetchingAllApplicationDeployments: getAllApplicationDeploymentsStatus(
    state.affiliationView
  ),
  currentUser: state.startup.currentUser,
  errors: state.errorStateManager.errors,
  userSettings: fetchUserSettings(state.affiliationView),
  applicationDeploymentDetails:
    state.affiliationView.applicationDeploymentDetails,
  isUpdatingUserSettings: state.affiliationView.isUpdatingUserSettings,
  isRefreshingApplicationDeployment:
    state.affiliationView.isRefreshingApplicationDeployment
});

export const AffiliationViewValidatorConnected = connect(
  mapStateToProps,
  {
    addErrors: (errors: any[]) => addErrors(errors),
    closeError: (id: number) => closeError(id),
    refreshAffiliations: (affiliations: string[]) =>
      refreshAffiliations(affiliations),
    findAllApplicationDeployments: (affiliations: string[]) =>
      findAllApplicationDeployments(affiliations),
    getUserSettings: () => getUserSettings(),
    updateUserSettings: (userSettings: IUserSettings) =>
      updateUserSettings(userSettings),
    findApplicationDeploymentDetails: (id: string) =>
      findApplicationDeploymentDetails(id)
  }
)(AffiliationViewValidator);
