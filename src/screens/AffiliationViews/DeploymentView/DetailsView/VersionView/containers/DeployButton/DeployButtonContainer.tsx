import { connect } from 'react-redux';
import { DeployButton } from './DeployButton';
import { mapStateToProps, mapDispatchToProps } from './DeployButton.state';

export const DeployButtonContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(DeployButton);
