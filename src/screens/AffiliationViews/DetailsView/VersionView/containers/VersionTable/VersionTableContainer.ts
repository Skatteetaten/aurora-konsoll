import { connect } from 'react-redux';

import { mapDispatchToProps, mapStateToProps } from './VersionTable.state';
import { VersionTabel } from './VersionTable';

export const VersionTableContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(VersionTabel);
