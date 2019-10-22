import { connect } from 'react-redux';
import { mapStateToProps } from './VersionView.state';
import { VersionView } from './VersionView';

export const VersionViewContainer = connect(mapStateToProps)(VersionView);
