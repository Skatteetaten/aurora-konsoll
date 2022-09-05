import { RootState, ReduxProps } from 'web/store/types';

import { fetchCname } from 'web/store/state/dns/action.creators';
import { Azure, OnPrem } from 'web/services/auroraApiClients/dnsClient/query';

interface Props {
  affiliation: string;
}

export const mapDispatchToProps = {
  fetchCname,
};

interface State {
  isFetching: boolean;
  azure?: Azure[];
  onPrem?: OnPrem[];
}

export const mapStateToProps = ({ dns }: RootState): State => {
  const { isFetching, azure, onPrem } = dns;
  return {
    isFetching,
    azure,
    onPrem,
  };
};

export type DnsViewRoutesProps = Props &
  ReduxProps<typeof mapDispatchToProps, typeof mapStateToProps>;
