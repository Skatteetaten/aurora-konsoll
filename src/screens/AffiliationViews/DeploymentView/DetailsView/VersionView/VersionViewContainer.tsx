import { connect } from 'react-redux';
import { mapStateToProps, mapDispatchToProps } from './VersionView.state';
import { VersionView } from './VersionView';

export const VersionViewContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(VersionView);
