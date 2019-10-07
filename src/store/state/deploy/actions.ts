import { createAction } from 'redux-ts-utils';
import { ActionType } from 'typesafe-actions';

const action = (action: string) => `deploy/${action}`;

const isDeploying = createAction<{ inProgress: boolean; version: string }>(
  action('DEPLOY')
);
const deployResult = createAction<{ version: string; success: boolean }>(
  action('DEPLOY_SUCCESS')
);

export const actions = {
  isDeploying,
  deployResult
};

export type DeployAction = ActionType<typeof actions>;
