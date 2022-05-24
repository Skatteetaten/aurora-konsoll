import { connect } from 'react-redux';
import {
  mapStateToProps,
  mapDispatchToProps,
} from './StorageGridViewRoutes.state';
import { StorageGridViewRoutes } from './StorageGridViewRoutes';

export const StorageGridViewRoutesContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(StorageGridViewRoutes);
