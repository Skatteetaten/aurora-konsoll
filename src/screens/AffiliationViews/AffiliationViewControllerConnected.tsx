import {
  addError,
  closeError,
  getNextError
} from 'models/StateManager/state/actions';
import { connect } from 'react-redux';
import { RootState } from 'store/types';
import AffiliationViewValidator from './AffiliationViewValidator';
import { refreshAffiliations } from './state/actions';
import { IAffiliationViewsState } from './state/reducer';

const getAffiliationsFetchingStatus = (state: IAffiliationViewsState) =>
  state.isRefreshingAffiliations;

const mapStateToProps = (state: RootState) => ({
  isFetchingAffiliations: getAffiliationsFetchingStatus(state.affiliationViews),
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
      refreshAffiliations(affiliations)
  }
)(AffiliationViewValidator);
