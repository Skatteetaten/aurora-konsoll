import ActionButton from 'aurora-frontend-react-komponenter/ActionButton';
import * as React from 'react';
import { Route, RouteComponentProps } from 'react-router-dom';

import { IApplication } from 'services/AuroraApiClient/types';
import PodCard from './PodCard';

interface IDetailsViewProps {
  applications: IApplication[];
}

type DetailsRouteProps = RouteComponentProps<{
  affiliation: string;
  environment: string;
  application: string;
}>;

const DetailsView = ({
  applications,
  match,
  history
}: IDetailsViewProps & DetailsRouteProps) => {
  const { affiliation, application, environment } = match.params;

  const current = applications.find(
    app => app.environment === environment && app.name === application
  );

  const back = () =>
    history.push({
      pathname: `/app/${affiliation}`
    });

  if (!current) {
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
        {current.environment}/{current.name}
      </h1>
      <p>{current.version.auroraVersion}</p>
      {current.pods.map(pod => <PodCard pod={pod} key={pod.name} />)}
    </div>
  );
};

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
