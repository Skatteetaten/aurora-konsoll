import DnsView from './DnsView';
import { connect } from 'react-redux';
import { RootState } from 'web/store/types';
import { fetchCnameInfos } from 'web/store/state/dns/action.creators';

const mapStateToProps = ({ dns }: RootState) => {
  const { isFetching, cnameInfos } = dns;
  return {
    isFetching,
    cnameInfos,
  };
};

export const DnsViewContainer = connect(mapStateToProps, {
  onFetch: (affiliation: string) => fetchCnameInfos(affiliation),
})(DnsView);
