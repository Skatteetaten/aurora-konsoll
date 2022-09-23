import { RootState, ReduxProps } from 'web/store/types';

import { fetchCnames } from 'web/store/state/dns/action.creators';
import { AzureData, OnPremData } from 'web/store/state/dns/reducer';

interface Props {
  affiliation: string;
}

export const mapDispatchToProps = {
  fetchCnames,
};

interface State {
  isFetching: boolean;
  azure?: AzureData[];
  onPrem?: OnPremData[];
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
