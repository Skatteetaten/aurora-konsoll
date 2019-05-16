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
import { IAffiliationViewsState } from './state/reducer';

const getAffiliationsFetchingStatus = (state: IAffiliationViewsState) =>
  state.isRefreshingAffiliations;

const getAllApplicationDeployments = (state: IAffiliationViewsState) =>
  state.allApplicationDeploymentsResult;

const getAllApplicationDeploymentsStatus = (state: IAffiliationViewsState) =>
  state.isFetchingAllApplicationDeployments;

const fetchUserSettings = (state: IAffiliationViewsState) => state.userSettings;

const mapStateToProps = (state: RootState) => ({
  isFetchingAffiliations: getAffiliationsFetchingStatus(state.affiliationViews),
  allApplicationDeployments: getAllApplicationDeployments(
    state.affiliationViews
  ),
  isFetchingAllApplicationDeployments: getAllApplicationDeploymentsStatus(
    state.affiliationViews
  ),
  currentUser: state.startup.currentUser,
  errors: state.errorStateManager.errors,
  userSettings: fetchUserSettings(state.affiliationViews),
  applicationDeploymentDetails:
    state.affiliationViews.applicationDeploymentDetails,
  isUpdatingUserSettings: state.affiliationViews.isUpdatingUserSettings,
  isRefreshingApplicationDeployment:
    state.affiliationViews.isRefreshingApplicationDeployment
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
