import { connect } from 'react-redux';
import { VersionTypeSelector } from './VersionTypeSelector';
import {
  mapStateToProps,
  mapDispatchToProps
} from './VersionTypeSelector.state';

export const VersionTypeSelectorContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(VersionTypeSelector);
