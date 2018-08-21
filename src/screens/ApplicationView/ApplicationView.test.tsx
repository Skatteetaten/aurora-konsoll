import * as React from 'react';

import { mount } from 'enzyme';

import { MemoryRouter } from 'react-router';
import ApplicationView from './ApplicationView';

it('renders without crashing', () => {
  const handleSelectedApplications = jest.fn();
  const handleFetchTags = jest.fn();
  const handleClearTags = jest.fn();

  const testKonsoll = {
    affiliation: 'aurora',
    environment: 'test',
    name: 'konsoll',
    pods: [],
    repository: 'test',
    statusCode: 'HEALTHY',
    version: {
      auroraVersion: '1',
      deployTag: '1'
    }
  };
  const wrapper = mount(
    <MemoryRouter initialEntries={['/app/aurora/details/test/konsoll']}>
      <ApplicationView
        affiliation={'aurora'}
        applications={[testKonsoll]}
        handleSelectedApplications={handleSelectedApplications}
        loading={false}
        tagsLoading={false}
        selectedApplications={[]}
        handleFetchTags={handleFetchTags}
        handleClearTags={handleClearTags}
      />
    </MemoryRouter>
  );

  const appWrapper = wrapper.at(0);

  expect(appWrapper.find('p').text()).toEqual(
    'Could not find application test/konsoll'
  );
  // appWrapper.setProps({
  //   applications: [testKonsoll]
  // });

  // const updatedWrapper = wrapper.update();
  // // tslint:disable-next-line:no-console
  // console.log(updatedWrapper.debug());

  // expect(updatedWrapper.props().applications.length).toBe(1);

  // expect(
  //   appWrapper
  //     .find('p')
  //     .first()
  //     .text()
  // ).toEqual('DeployTag: 1');
  // wrapper.setProps({ affiliation: 'aurora', loading: true });
  // expect(wrapper.find('p').text()).toEqual('Laster applikasjoner for aurora');
  // wrapper.unmount();
  // expect(handleClearTags.mock.calls.length).toBe(1);
});
