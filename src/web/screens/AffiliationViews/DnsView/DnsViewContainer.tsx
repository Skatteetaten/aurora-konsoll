import { connect } from 'react-redux';
import { DnsViewRoutes } from './DnsViewRoutes';
import { mapDispatchToProps, mapStateToProps } from './DnsViewRoutes.state';

export const DnsViewContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(DnsViewRoutes);
