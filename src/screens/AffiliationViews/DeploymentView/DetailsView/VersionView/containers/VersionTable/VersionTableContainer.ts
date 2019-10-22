import { connect } from 'react-redux';

import { mapDispatchToProps, mapStateToProps } from './VersionTable.state';
import { VersionTable } from './VersionTable';

export const VersionTableContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(VersionTable);
