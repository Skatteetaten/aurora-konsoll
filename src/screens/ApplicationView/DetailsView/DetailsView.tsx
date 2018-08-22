import ActionButton from 'aurora-frontend-react-komponenter/ActionButton';
import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import {
  IApplicationInstance,
  ITagsPaged
} from 'services/AuroraApiClient/types';
import PodCard from './PodCard';
import Versions from './Versions';

interface IDetailsViewState {
  application?: IApplicationInstance;
}

export interface IDetailsViewProps {
  applications: IApplicationInstance[];
  tagsLoading: boolean;
  tagsPaged?: ITagsPaged;
  handleFetchTags: (respoitory: string, cursor?: string) => void;
  handleClearTags: () => void;
}

export type DetailsRouteProps = RouteComponentProps<{
  affiliation: string;
  environment: string;
  application: string;
}>;

class DetailsView extends React.Component<
  IDetailsViewProps & DetailsRouteProps,
  IDetailsViewState
> {
  public state: IDetailsViewState = {
    application: undefined
  };

  public componentWillUnmount() {
    this.props.handleClearTags();
  }

  public componentDidMount() {
    const { application, environment } = this.props.match.params;

    const current = this.props.applications.find(
      app => app.environment === environment && app.name === application
    );

    if (current) {
      this.setState(() => ({
        application: current
      }));

      this.props.handleFetchTags(current.repository);
    }
  }

  public fetchMoreTags = (cursor: string) => {
    const { application } = this.state;

    if (application) {
      this.props.handleFetchTags(application.repository, cursor);
    }
  };

  public render() {
    const { affiliation, application, environment } = this.props.match.params;
    const { tagsLoading, tagsPaged } = this.props;

    const back = () =>
      this.props.history.push({
        pathname: `/app/${affiliation}`
      });

    if (!this.state.application) {
      return (
        <p>
          Could not find application {environment}/{application}
        </p>
      );
    }

    const { version } = this.state.application;

    return (
      <div>
        <ActionButton icon="Back" onClick={back}>
          Applications
        </ActionButton>
        <h1>
          {this.state.application.environment}/{this.state.application.name}
        </h1>
        <p>DeployTag: {version.deployTag}</p>
        <p>AuroraVersion: {version.auroraVersion}</p>
        <p>{this.state.application.repository}</p>
        {this.state.application.pods.map(pod => (
          <PodCard pod={pod} key={pod.name} />
        ))}
        <Versions
          tagsLoading={tagsLoading}
          tagsPaged={tagsPaged}
          handleFetchTags={this.fetchMoreTags}
        />
      </div>
    );
  }
}

export default DetailsView;
