import { addErrors, closeError } from 'screens/ErrorHandler/state/actions';
import { IUserSettings } from 'models/UserSettings';
import { connect } from 'react-redux';
import { RootState } from 'store/types';
import { AffiliationViewValidator } from './AffiliationViewValidator';
import {
  findAllApplicationDeployments,
  findApplicationDeploymentDetails,
  getUserSettings,
  refreshAffiliations,
  updateUserSettings
} from './state/actions';

const mapStateToProps = ({ affiliationView, ...state }: RootState) => ({
  isFetchingAffiliations: affiliationView.isRefreshingAffiliations,
  allApplicationDeployments: affiliationView.allApplicationDeploymentsResult,
  isFetchingAllApplicationDeployments:
    affiliationView.isFetchingAllApplicationDeployments,
  currentUser: state.startup.currentUser,
  errors: state.errors.errors,
  userSettings: affiliationView.userSettings,
  applicationDeploymentDetails: affiliationView.applicationDeploymentDetails,
  isUpdatingUserSettings: affiliationView.isUpdatingUserSettings,
  isRefreshingApplicationDeployment:
    affiliationView.isRefreshingApplicationDeployment
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
