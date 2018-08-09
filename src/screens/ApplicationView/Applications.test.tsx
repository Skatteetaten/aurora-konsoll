import * as React from 'react';

import { mount } from 'enzyme';

import { IApplicationResult } from 'services/AuroraApiClient';
import { ApplicationsView } from './Applications';

it('renders without crashing', () => {
  const handleSelectedApplications = (apps: IApplicationResult[]) => {
    return;
  };

  const wrapper = mount(
    <ApplicationsView
      applications={[]}
      handleSelectedApplications={handleSelectedApplications}
      loading={false}
      selectedApplications={[]}
    />
  );

  expect(wrapper.find('p').text()).toEqual('Velg en tilhørighet');
  wrapper.setProps({ affiliation: 'aurora', loading: true });
  expect(wrapper.find('p').text()).toEqual('Laster applikasjoner for aurora');
});
