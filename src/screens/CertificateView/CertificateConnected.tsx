import { connect } from 'react-redux';
import { RootState } from 'store/types';
import { CertificateWithApi } from './Certificate';
import { fetchCertificates } from './state/actions';
import { ICertificateState } from './state/reducers';

const getFetchingStatus = (state: ICertificateState) =>
  state.isFetchingCertificates;

const getCertificates = (state: ICertificateState) => state.certificates;

const mapStateToProps = (state: RootState) => ({
  isFetching: getFetchingStatus(state.certificate),
  certificates: getCertificates(state.certificate)
});

export const CertificateConnected = connect(
  mapStateToProps,
  {
    onFetch: () => fetchCertificates()
  }
)(CertificateWithApi);
