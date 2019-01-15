import { connect } from 'react-redux';
import { counter } from '../features/counter/components/counter';
import { countersActions, countersSelectors } from '../features/counter/index';
import { RootState } from '../store/types';

const mapStateToProps = (state: RootState) => ({
  count: countersSelectors.getReduxCounter(state.counters)
});

export const CounterConnected = connect(
  mapStateToProps,
  {
    onIncrement: countersActions.increment
  }
)(counter);
