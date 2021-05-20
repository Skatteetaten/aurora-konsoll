import * as React from 'react';
import DnsView from './DnsView';
import { connect } from 'react-redux';
import { RootState } from 'store/types';
import { fetchDnsEntriesRedux } from 'store/state/dns/action.creators';

interface props {
  affiliation: string;
}

class DnsViewController extends React.Component<props, {}> {
  public render() {
    const { affiliation } = this.props;
    return <DnsConnected affiliation={affiliation} />;
  }
}

export default DnsViewController;

const mapStateToProps = ({ dns }: RootState) => ({
  loading: dns.isFetching,
  dnsEntries: dns.dnsEntires,
});

export const DnsConnected = connect(mapStateToProps, {
  onFetch: (affiliation: string) => fetchDnsEntriesRedux(affiliation),
})(DnsView);
