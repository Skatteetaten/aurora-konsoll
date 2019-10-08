import * as React from 'react';

import { mount } from 'enzyme';

import ActionButton from 'aurora-frontend-react-komponenter/ActionButton';
import Spinner from 'components/Spinner';
import UpgradeButton from './UpgradeButton';
import { ITag } from 'models/Tag';
import { tagFactory } from 'testData/testDataBuilders';
import { ImageTagType } from 'models/ImageTagType';

describe('UpgradeVersionDialog', () => {
  const redeploy = () => {
    return;
  };

  const handleSelectNextTag = (item?: ITag) => {
    return;
  };

  it('should not show a button and should show a spinner when isRedeploying=true and tag===selectedTag', () => {
    const wrapper = mount(
      <UpgradeButton
        previousVersion="latest"
        tag={tagFactory.build()}
        selectedTag={tagFactory.build()}
        isRedeploying={true}
        redeployWithVersion={redeploy}
        redeployWithCurrentVersion={redeploy}
        handleSelectNextTag={handleSelectNextTag}
        hasPermissionToUpgrade={true}
      />
    );

    const spinner = wrapper.find(Spinner);
    expect(spinner).toHaveLength(1);

    const button = wrapper.find(ActionButton);
    expect(button).toHaveLength(0);
  });
  it('should show a button and should not show a spinner when isRedeploying=true and tag!==selectedTag', () => {
    const wrapper = mount(
      <UpgradeButton
        previousVersion="latest"
        tag={tagFactory.build()}
        selectedTag={tagFactory.build({ type: ImageTagType.MAJOR, name: '1' })}
        isRedeploying={true}
        redeployWithVersion={redeploy}
        redeployWithCurrentVersion={redeploy}
        handleSelectNextTag={handleSelectNextTag}
        hasPermissionToUpgrade={true}
      />
    );

    const spinner = wrapper.find(Spinner);
    expect(spinner).toHaveLength(0);

    const button = wrapper.find(ActionButton);
    expect(button).toHaveLength(1);
    expect(button.prop('disabled')).toBeTruthy();
    expect(button.text()).toContain('Deploy');
  });
  it('should disable button and the button should display "Deploy" when hasPermissionToUpgrade=false', () => {
    const wrapper = mount(
      <UpgradeButton
        previousVersion="latest"
        tag={tagFactory.build()}
        selectedTag={tagFactory.build()}
        isRedeploying={false}
        redeployWithVersion={redeploy}
        redeployWithCurrentVersion={redeploy}
        handleSelectNextTag={handleSelectNextTag}
        hasPermissionToUpgrade={false}
      />
    );
    const spinner = wrapper.find(Spinner);
    expect(spinner).toHaveLength(0);

    const button = wrapper.find(ActionButton);
    expect(button).toHaveLength(1);
    expect(button.prop('disabled')).toBeTruthy();
    expect(button.text()).toContain('Deploy');
  });
});
