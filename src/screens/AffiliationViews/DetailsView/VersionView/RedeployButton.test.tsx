import * as React from 'react';

import { mount } from 'enzyme';

import ActionButton from 'aurora-frontend-react-komponenter/ActionButton';
import Spinner from 'components/Spinner';
import { ITag } from 'models/Tag';
import { tagFactory } from 'testData/testDataBuilders';
import RedployButton from './RedployButton';
import { DeployVersionType } from '../DetailsViewController';

describe('UpgradeVersionDialog', () => {
  const redeploy = () => {
    return;
  };

  const handleSelectNextTag = (item?: ITag) => {
    return;
  };

  it('should not show a button and should show a spinner when isRedeploying=true', () => {
    const wrapper = mount(
      <RedployButton
        tag={tagFactory.build()}
        isRedeploying={true}
        redeployWithVersion={redeploy}
        redeployWithCurrentVersion={redeploy}
        handleSelectNextTag={handleSelectNextTag}
        hasPermissionToUpgrade={true}
        deployVersionType={DeployVersionType.CURRENT_VERSION}
      />
    );

    const spinner = wrapper.find(Spinner);
    expect(spinner).toHaveLength(1);

    const button = wrapper.find(ActionButton);
    expect(button).toHaveLength(0);
  });

  it('should show a button and should not show a spinner when isRedeploying=false and deployVersionType=ACTIVE_DEPLOYMENT_VERSION', () => {
    const wrapper = mount(
      <RedployButton
        tag={tagFactory.build()}
        isRedeploying={false}
        redeployWithVersion={redeploy}
        redeployWithCurrentVersion={redeploy}
        handleSelectNextTag={handleSelectNextTag}
        hasPermissionToUpgrade={true}
        deployVersionType={DeployVersionType.ACTIVE_DEPLOYMENT_VERSION}
      />
    );

    const spinner = wrapper.find(Spinner);
    expect(spinner).toHaveLength(0);

    const button = wrapper.find(ActionButton);
    expect(button).toHaveLength(1);
    expect(button.prop('disabled')).toBeFalsy();
    expect(button.text()).toContain('Redeploy');
  });

  it('should disable button and the button should display "Redeploy" when hasPermissionToUpgrade=false', () => {
    const wrapper = mount(
      <RedployButton
        tag={tagFactory.build()}
        isRedeploying={false}
        redeployWithVersion={redeploy}
        redeployWithCurrentVersion={redeploy}
        handleSelectNextTag={handleSelectNextTag}
        hasPermissionToUpgrade={false}
        deployVersionType={DeployVersionType.AURORA_CONFIG_VERSION}
      />
    );

    const spinner = wrapper.find(Spinner);
    expect(spinner).toHaveLength(0);

    const button = wrapper.find(ActionButton);
    expect(button).toHaveLength(1);
    expect(button.prop('disabled')).toBeTruthy();
    expect(button.text()).toContain('Redeploy');
  });
});
