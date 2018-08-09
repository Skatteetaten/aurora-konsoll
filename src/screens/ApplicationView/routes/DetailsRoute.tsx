import ActionButton from 'aurora-frontend-react-komponenter/ActionButton';
import PodCard from 'components/PodCard';
import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { IApplicationResult } from 'services/AuroraApiClient';

interface IDetailsProps {
  applications: IApplicationResult[];
}

type DetailsRouteProps = RouteComponentProps<{
  affiliation: string;
  environment: string;
  application: string;
}>;

const Details = ({
  applications,
  match,
  history
}: IDetailsProps & DetailsRouteProps) => {
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

// const DetailsRoute = () => (
//   <Route
//     exact={true}
//     path="/app/:affiliation/details/:environment/:application"
//     render={Details}
//   />
// );

export default Details;
