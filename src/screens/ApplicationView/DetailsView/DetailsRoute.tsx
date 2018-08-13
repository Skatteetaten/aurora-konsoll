import ActionButton from 'aurora-frontend-react-komponenter/ActionButton';
import * as React from 'react';
import { Route, RouteComponentProps } from 'react-router-dom';

import { IApplication } from 'services/AuroraApiClient/types';
import PodCard from './PodCard';

interface IDetailsViewState {
  application?: IApplication;
}

interface IDetailsViewProps {
  applications: IApplication[];
  handleFetchTags: (respoitory: string) => void;
}

type DetailsRouteProps = RouteComponentProps<{
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

  public render() {
    const { affiliation, application, environment } = this.props.match.params;

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

    return (
      <div>
        <ActionButton icon="Back" onClick={back}>
          Applications
        </ActionButton>
        <h1>
          {this.state.application.environment}/{this.state.application.name}
        </h1>
        <p>{this.state.application.version.auroraVersion}</p>
        <p>{this.state.application.repository}</p>
        {this.state.application.pods.map(pod => (
          <PodCard pod={pod} key={pod.name} />
        ))}
      </div>
    );
  }
}

const DetailsRouteWrapper = (props: IDetailsViewProps) => (
  routerProps: DetailsRouteProps
) => <DetailsView {...props} {...routerProps} />;

const DetailsRoute = (props: IDetailsViewProps) => (
  <Route
    exact={true}
    path="/app/:affiliation/details/:environment/:application"
    render={DetailsRouteWrapper(props)}
  />
);

export default DetailsRoute;
