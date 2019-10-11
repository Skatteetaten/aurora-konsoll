import { connect } from 'react-redux';
import { mapStateToProps, mapDispatchToProps } from './FetchMoreVersions.state';
import { FetchMoreVersions } from './FetchMoreVersions';

export const FetchMoreVersionsContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(FetchMoreVersions);
