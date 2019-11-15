import { connect } from 'react-redux';
import {
  mapDispatchToProps,
  mapStateToProps
} from './RedeployRowAndVersionTable.state';
import { RedeployRowAndVersionTable } from './RedeployRowAndVersionTable';

export const RedeployRowAndVersionTableContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(RedeployRowAndVersionTable);
