import * as React from 'react';

import { mount } from 'enzyme';

import Button from 'aurora-frontend-react-komponenter/Button';
import Spinner from 'components/Spinner';
import UpgradeVersionDialog from './UpgradeVersionDialog';

describe('UpgradeVersionDialog', () => {
  const redeploy = () => {
    return;
  };

  it('should disable button and the button should show a spinner when isRedeployingCurrentVersion=true', () => {
    const wrapper = mount(
      <UpgradeVersionDialog
        previousVersion="latest"
        newVersion="0.2.5"
        isRedeploying={true}
        isRedeployingCurrentVersion={false}
        redeployWithVersion={redeploy}
        redeployWithCurrentVersion={redeploy}
        canUpgrade={true}
      />
    );
    const spinner = wrapper.find(Spinner);
    expect(spinner).toHaveLength(1);

    const button = wrapper.find(Button);
    expect(button.prop('disabled')).toBeTruthy();
  });
  it('should enable button and the button should display "Deploy nåværende versjon" when canUpgrade=false', () => {
    const wrapper = mount(
      <UpgradeVersionDialog
        previousVersion="latest"
        newVersion={undefined}
        isRedeploying={false}
        isRedeployingCurrentVersion={false}
        redeployWithVersion={redeploy}
        redeployWithCurrentVersion={redeploy}
        canUpgrade={false}
      />
    );
    const spinner = wrapper.find(Spinner);
    expect(spinner).toHaveLength(0);

    const button = wrapper.find(Button);
    expect(button.prop('disabled')).toBeFalsy();
    expect(button.text()).toEqual('Deploy nåværende versjon');
  });
  it('should enable button and the button should display "Endre versjon" when canUpgrade=true', () => {
    const wrapper = mount(
      <UpgradeVersionDialog
        previousVersion="latest"
        newVersion="0.2.5"
        isRedeploying={false}
        isRedeployingCurrentVersion={false}
        redeployWithVersion={redeploy}
        redeployWithCurrentVersion={redeploy}
        canUpgrade={true}
      />
    );
    const spinner = wrapper.find(Spinner);
    expect(spinner).toHaveLength(0);

    const button = wrapper.find(Button);
    expect(button.prop('disabled')).toBeFalsy();
    expect(button.text()).toEqual('Endre versjon');
  });
});
