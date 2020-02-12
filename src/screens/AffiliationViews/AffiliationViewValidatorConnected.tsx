import { connect } from 'react-redux';
import { RootState, ReduxProps } from 'store/types';
import { AffiliationViewValidator } from './AffiliationViewValidator';

const mapStateToProps = ({ startup }: RootState) => ({
  currentUser: startup.currentUser
});

export type AffiliationViewValidatorState = ReduxProps<
  {},
  typeof mapStateToProps
>;

export const AffiliationViewValidatorConnected = connect(mapStateToProps)(
  AffiliationViewValidator
);
