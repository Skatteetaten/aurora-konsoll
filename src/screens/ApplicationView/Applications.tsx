import * as React from 'react';

import {
  IApplicationInstance,
  ITagsPaged
} from 'services/AuroraApiClient/types';

import { IAuroraApiComponentProps } from 'components/AuroraApi';
import { withAuroraApi } from 'components/AuroraApi';
import ApplicationsView from './ApplicationView';

interface IApplicationsProps extends IAuroraApiComponentProps {
  affiliation?: string;
}

interface IApplicationsState {
  applications: IApplicationInstance[];
  loading: boolean;
  tagsLoading: boolean;
  tagsPaged?: ITagsPaged;
  fetchError?: Error;
  selectedApplications: IApplicationInstance[];
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

  public handleSelectedApplications = (apps: IApplicationInstance[]) => {
    this.setState(() => ({
      selectedApplications: apps
    }));
  };

  public fetchTags = async (repository: string, cursor?: string) => {
    this.setState(() => ({
      tagsLoading: true
    }));

    try {
      const newTagsPaged = await this.props.clients.apiClient.findTagsPaged(
        repository,
        cursor
      );

      const previousTagsPaged = this.state.tagsPaged || {
        endCursor: '',
        hasNextPage: false,
        hasPreviousPage: false,
        startCursor: '',
        tags: []
      };

      const tagsPaged: ITagsPaged = {
        ...newTagsPaged,
        tags: [...previousTagsPaged.tags, ...newTagsPaged.tags]
      };
      this.setState(() => ({
        tagsLoading: false,
        tagsPaged
      }));
    } catch (error) {
      this.setState(() => ({
        fetchError: error,
        tagsLoading: false
      }));
    }
  };

  public clearTags = () => {
    this.setState(() => ({
      tagsPaged: undefined
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
    const {
      applications,
      loading,
      selectedApplications,
      tagsPaged,
      tagsLoading,
      fetchError
    } = this.state;
    const { affiliation } = this.props;

    if (fetchError) {
      return <p>{fetchError.message}</p>;
    }

    return (
      <ApplicationsView
        affiliation={affiliation}
        applications={applications}
        loading={loading}
        selectedApplications={selectedApplications}
        handleSelectedApplications={this.handleSelectedApplications}
        handleFetchTags={this.fetchTags}
        handleClearTags={this.clearTags}
        tagsPaged={tagsPaged}
        tagsLoading={tagsLoading}
      />
    );
  }
}

export default withAuroraApi(Applications);
