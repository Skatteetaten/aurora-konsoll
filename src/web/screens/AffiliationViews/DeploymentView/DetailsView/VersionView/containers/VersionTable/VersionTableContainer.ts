import { connect } from 'react-redux';

import { mapStateToProps } from './VersionTable.state';
import { VersionTable } from './VersionTable';

export const VersionTableContainer = connect(mapStateToProps)(VersionTable);
