import * as React from 'react';

import { mount } from 'enzyme';

import { IApplicationInstance } from 'services/AuroraApiClient/types';
import ApplicationsView from './ApplicationView';

it('renders without crashing', () => {
  const handleSelectedApplications = (apps: IApplicationInstance[]) => {
    return;
  };

  const handleFetchTags = (repository: string) => {
    return;
  };

  const handleClearTags = () => {
    return;
  };

  const wrapper = mount(
    <ApplicationsView
      applications={[]}
      handleSelectedApplications={handleSelectedApplications}
      loading={false}
      tagsLoading={false}
      selectedApplications={[]}
      handleFetchTags={handleFetchTags}
      handleClearTags={handleClearTags}
    />
  );

  expect(wrapper.find('p').text()).toEqual('Velg en tilhørighet');
  wrapper.setProps({ affiliation: 'aurora', loading: true });
  expect(wrapper.find('p').text()).toEqual('Laster applikasjoner for aurora');
});
