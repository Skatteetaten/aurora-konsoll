import DnsView from './DnsView';
import { connect } from 'react-redux';
import { RootState } from 'store/types';
import { fetchDnsEntriesRedux } from 'store/state/dns/action.creators';

const mapStateToProps = ({ dns }: RootState) => {
  const { isFetching, cnameInfos } = dns;
  return {
    isFetching,
    cnameInfos,
  };
};

export const DnsViewContainer = connect(mapStateToProps, {
  onFetch: (affiliation: string) => fetchDnsEntriesRedux(affiliation),
})(DnsView);
