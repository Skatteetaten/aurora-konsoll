import Spinner from 'aurora-frontend-react-komponenter/Spinner';
import * as React from 'react';
import styled from 'styled-components';

import { IApplication } from 'services/AuroraApiClient/types';

import DetailsRoute from './DetailsView/DetailsRoute';
import MatrixRoute from './MatrixView/MatrixRoute';

interface IApplicationsViewProps {
  affiliation?: string;
  applications: IApplication[];
  loading: boolean;
  selectedApplications: IApplication[];
  handleSelectedApplications: (apps: IApplication[]) => void;
  handleFetchTags: (repository: string) => void;
}

export const ApplicationsView = ({
  affiliation,
  applications,
  loading,
  selectedApplications,
  handleSelectedApplications,
  handleFetchTags
}: IApplicationsViewProps) => {
  if (!affiliation) {
    return <p>Velg en tilhørighet</p>;
  }

  if (loading) {
    return (
      <Loading>
        <Spinner size={Spinner.Size.large} />
        <p>Laster applikasjoner for {affiliation}</p>
      </Loading>
    );
  }

  return (
    <>
      <MatrixRoute
        affiliation={affiliation}
        applications={applications}
        selectedApplications={selectedApplications}
        handleSelectedApplications={handleSelectedApplications}
      />
      <DetailsRoute
        applications={applications}
        handleFetchTags={handleFetchTags}
      />
    </>
  );
};

const Loading = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  p {
    text-align: center;
  }
`;

export default ApplicationsView;
