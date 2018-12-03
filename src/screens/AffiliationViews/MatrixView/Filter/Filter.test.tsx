import { shallow } from 'enzyme';
import * as React from 'react';

import Checkbox from 'aurora-frontend-react-komponenter/Checkbox';
import { IApplicationDeployment } from 'models/ApplicationDeployment';
import { ImageTagType } from 'models/ImageTagType';

import {
  ApplicationDeploymentClient,
  ImageRepositoryClient,
  NetdebugClient,
  UserSettingsClient
} from 'services/auroraApiClients';
import { Filter, SelectionType } from './Filter';

describe('Filter', () => {
  const applicationCheckboxIndex = 0;
  const environmentCheckboxIndex = 2;

  const ApplicationDeploymentMock = jest.fn<ApplicationDeploymentClient>(
    () => ({})
  );
  const ImageRepositoryClientMock = jest.fn<ImageRepositoryClient>(() => ({}));
  const NetdebugClientMock = jest.fn<NetdebugClient>(() => ({}));
  const UserSettingsClientMock = jest.fn<UserSettingsClient>(() => ({}));

  const clients = {
    applicationDeploymentClient: new ApplicationDeploymentMock(),
    imageRepositoryClient: new ImageRepositoryClientMock(),
    netdebugClient: new NetdebugClientMock(),
    userSettingsClient: new UserSettingsClientMock()
  };

  const emptyFilter = { applications: [], environments: [] };
  const deployments: IApplicationDeployment[] = [
    {
      id: '1',
      affiliation: 'paas',
      name: 'app1',
      environment: 'env1',
      status: {
        code: ''
      },
      version: {
        auroraVersion: '',
        deployTag: {
          name: 'version',
          type: ImageTagType.AURORA_SNAPSHOT_VERSION,
          lastModified: ''
        },
        releaseTo: ''
      },
      repository: '',
      time: ''
    },
    {
      id: '2',
      affiliation: 'paas',
      name: 'app2',
      environment: 'env2',
      status: {
        code: ''
      },
      version: {
        auroraVersion: '',
        deployTag: {
          name: 'version',
          type: ImageTagType.AURORA_SNAPSHOT_VERSION,
          lastModified: ''
        },
        releaseTo: ''
      },
      repository: '',
      time: ''
    }
  ];
  const updateFilter = () => {
    return;
  };
  const deleteFilter = (filtername: string) => {
    return;
  };
  it('should filter applications when checkbox is checked', () => {
    const wrapper = shallow(
      <Filter
        affiliation="paas"
        updateFilter={updateFilter}
        allDeployments={deployments}
        filters={emptyFilter}
        allFilters={[]}
        clients={clients}
        deleteFilter={deleteFilter}
      />
    );
    const checkbox = wrapper.find(Checkbox);
    checkbox.at(applicationCheckboxIndex).simulate('change');
    const applications = wrapper.state('applications');
    expect(applications).toHaveLength(1);
    expect(applications).toContain('app1');
    const environments = wrapper.state('environments');
    expect(environments).toHaveLength(0);
  });

  it('should filter environments when checkbox is checked', () => {
    const wrapper = shallow(
      <Filter
        affiliation="paas"
        updateFilter={updateFilter}
        allDeployments={deployments}
        filters={emptyFilter}
        allFilters={[]}
        deleteFilter={deleteFilter}
        clients={clients}
      />
    );
    const checkbox = wrapper.find(Checkbox);
    checkbox.at(environmentCheckboxIndex).simulate('change');
    const applications = wrapper.state('applications');
    expect(applications).toHaveLength(0);
    const environments = wrapper.state('environments');
    expect(environments).toHaveLength(1);
    expect(environments).toContain('env1');
  });

  it('should filter applications/environments based on input props', () => {
    const wrapper = shallow(
      <Filter
        affiliation="paas"
        updateFilter={updateFilter}
        allDeployments={deployments}
        filters={{ applications: ['app1'], environments: [] }}
        allFilters={[]}
        deleteFilter={deleteFilter}
        clients={clients}
      />
    );
    const applications = wrapper.state('applications');
    const environments = wrapper.state('environments');

    expect(applications).toHaveLength(1);
    expect(applications).toContain('app1');
    expect(environments).toHaveLength(0);
  });

  it('should clear filters when affiliation is updated', () => {
    const wrapper = shallow(
      <Filter
        affiliation="paas"
        updateFilter={updateFilter}
        allDeployments={deployments}
        filters={{ applications: ['app1'], environments: ['env1'] }}
        allFilters={[]}
        deleteFilter={deleteFilter}
        clients={clients}
      />
    );
    wrapper.setProps({ affiliation: 'aurora' });
    const applications = wrapper.state('applications');
    const environments = wrapper.state('environments');

    expect(applications).toHaveLength(0);
    expect(environments).toHaveLength(0);
  });

  it('should clear all checkboxes when clear function is executed', () => {
    const wrapper = shallow(
      <Filter
        affiliation="paas"
        updateFilter={updateFilter}
        allDeployments={deployments}
        filters={{
          applications: ['app1', 'app2', 'app3'],
          environments: ['env1']
        }}
        allFilters={[]}
        deleteFilter={deleteFilter}
        clients={clients}
      />
    );

    wrapper
      .find(Checkbox)
      .at(0)
      .simulate('change');

    (wrapper.instance() as Filter).clearAllCheckboxes(
      SelectionType.Applications
    );
    (wrapper.instance() as Filter).clearAllCheckboxes(
      SelectionType.Environments
    );

    const checkboxes = wrapper.find(Checkbox);
    expect(checkboxes.at(0).prop('checked')).toBeFalsy();
    expect(checkboxes.at(1).prop('checked')).toBeFalsy();
    expect(checkboxes.at(2).prop('checked')).toBeFalsy();
    expect(checkboxes.at(3).prop('checked')).toBeFalsy();
  });

  it('should select all checkboxes when select function is executed', () => {
    const wrapper = shallow(
      <Filter
        affiliation="paas"
        updateFilter={updateFilter}
        allDeployments={deployments}
        filters={{
          applications: [],
          environments: []
        }}
        allFilters={[]}
        deleteFilter={deleteFilter}
        clients={clients}
      />
    );

    (wrapper.instance() as Filter).selectAllCheckboxes(
      SelectionType.Applications
    );
    (wrapper.instance() as Filter).selectAllCheckboxes(
      SelectionType.Environments
    );

    const checkboxes = wrapper.find(Checkbox);
    expect(checkboxes.at(0).prop('checked')).toBeTruthy();
    expect(checkboxes.at(1).prop('checked')).toBeTruthy();
    expect(checkboxes.at(2).prop('checked')).toBeTruthy();
    expect(checkboxes.at(3).prop('checked')).toBeTruthy();
  });
});