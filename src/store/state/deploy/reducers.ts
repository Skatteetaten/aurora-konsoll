import { reduceReducers, handleAction } from 'redux-ts-utils';

import { actions } from './actions';

export interface IDeployState {
  readonly deployingVersion?: string;
  readonly isDeploying: boolean;
  readonly lastDeploy?: {
    version: string;
    success: boolean;
  };
}

const initialState: IDeployState = {
  isDeploying: false
};

export const deployReducer = reduceReducers<IDeployState>(
  [
    handleAction(actions.isDeploying, (state, { payload }) => {
      const { inProgress, version } = payload;
      state.deployingVersion = inProgress ? version : undefined;
      state.isDeploying = inProgress;
    }),
    handleAction(actions.deployResult, (state, { payload }) => {
      state.lastDeploy = {
        success: payload.success,
        version: payload.version
      };
    })
  ],
  initialState
);
