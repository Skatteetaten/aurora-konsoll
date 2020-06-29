import { connect } from 'react-redux';
import { RootState } from 'store/types';
import { fetchWebsealStates } from './state/actions';
import { IWebsealReduxState } from './state/reducers';
import Webseal from './WebsealTable';

const getFetchingStatus = (state: IWebsealReduxState) =>
  state.isFetchingWebsealStates;
const getItems = (state: IWebsealReduxState) => state.websealStates;

const mapStateToProps = (state: RootState) => ({
  isFetchingWebsealStates: getFetchingStatus(state.webseal),
  websealStates: getItems(state.webseal),
});

export const WebsealConnected = connect(mapStateToProps, {
  onFetch: (affiliation: string) => fetchWebsealStates(affiliation),
})(Webseal);
