import {
  addError,
  closeError,
  getNextError
} from 'models/StateManager/state/actions';
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

const mapStateToProps = (state: RootState) => ({
  isFetchingAffiliations: getAffiliationsFetchingStatus(state.affiliationViews),
  allApplicationDeployments: getAllApplicationDeployments(
    state.affiliationViews
  ),
  isFetchingAllApplicationDeployments: getAllApplicationDeploymentsStatus(
    state.affiliationViews
  ),
  currentUser: state.startup.currentUser,
  errors: state.errorStateManager.errors
});

export const AffiliationViewValidatorConnected = connect(
  mapStateToProps,
  {
    addError: (error: Error) => addError(error),
    getNextError: () => getNextError(),
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
