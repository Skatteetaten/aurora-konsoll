import * as React from 'react';

import { IApplication } from 'services/AuroraApiClient/types';

import { IAuroraApiComponentProps } from 'components/AuroraApi';
import { withAuroraApi } from 'components/AuroraApi';
import ApplicationsView from './ApplicationView';

interface IApplicationsProps extends IAuroraApiComponentProps {
  affiliation?: string;
}

interface IApplicationsState {
  applications: IApplication[];
  loading: boolean;
  tagsLoading: boolean;
  selectedApplications: IApplication[];
}

class Applications extends React.Component<
  IApplicationsProps,
  IApplicationsState
> {
  public state: IApplicationsState = {
    applications: [],
    loading: false,
    selectedApplications: [],
    tagsLoading: false
  };

  public handleSelectedApplications = (apps: IApplication[]) => {
    this.setState(() => ({
      selectedApplications: apps
    }));
  };

  public fetchTags = async (repository: string) => {
    this.setState(() => ({
      tagsLoading: true
    }));
    const tagsPaged = await this.props.clients.apiClient.findTagsPaged(
      repository
    );

    // tslint:disable-next-line:no-console
    console.log(tagsPaged);

    this.setState(() => ({
      tagsLoading: false
    }));
  };

  public fetchApplications = async (affiliation: string) => {
    this.setState(() => ({
      loading: true
    }));

    const applications = await this.props.clients.apiClient.findAllApplicationsForAffiliations(
      [affiliation]
    );

    this.setState(() => ({
      applications,
      loading: false
    }));
  };

  public componentDidMount() {
    const { affiliation } = this.props;
    if (affiliation) {
      this.fetchApplications(affiliation);
    }
  }

  public componentDidUpdate(prevProps: IApplicationsProps) {
    const { affiliation } = this.props;
    if (affiliation && affiliation !== prevProps.affiliation) {
      this.fetchApplications(affiliation);
    }
  }

  public render() {
    const { applications, loading, selectedApplications } = this.state;
    const { affiliation } = this.props;
    return (
      <ApplicationsView
        affiliation={affiliation}
        applications={applications}
        loading={loading}
        selectedApplications={selectedApplications}
        handleSelectedApplications={this.handleSelectedApplications}
        handleFetchTags={this.fetchTags}
      />
    );
  }
}

export default withAuroraApi(Applications);
