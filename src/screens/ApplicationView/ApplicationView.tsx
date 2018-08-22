import Spinner from 'aurora-frontend-react-komponenter/Spinner';
import * as React from 'react';
import styled from 'styled-components';

import {
  IApplicationInstance,
  ITagsPaged
} from 'services/AuroraApiClient/types';

import DetailsViewRoute from './DetailsView/DetailsViewRoute';
import MatrixViewRoute from './MatrixView/MatrixViewRoute';

export interface IApplicationViewProps {
  affiliation?: string;
  applications: IApplicationInstance[];
  loading: boolean;
  tagsLoading: boolean;
  tagsPaged?: ITagsPaged;
  selectedApplications: IApplicationInstance[];
  handleSelectedApplications: (apps: IApplicationInstance[]) => void;
  handleFetchTags: (repository: string) => void;
  handleClearTags: () => void;
}

const ApplicationView: React.StatelessComponent<IApplicationViewProps> = ({
  affiliation,
  applications,
  loading,
  tagsLoading,
  tagsPaged,
  selectedApplications,
  handleSelectedApplications,
  handleFetchTags,
  handleClearTags
}) => {
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
      <MatrixViewRoute
        affiliation={affiliation}
        applications={applications}
        selectedApplications={selectedApplications}
        handleSelectedApplications={handleSelectedApplications}
      />
      <DetailsViewRoute
        applications={applications}
        handleFetchTags={handleFetchTags}
        tagsPaged={tagsPaged}
        tagsLoading={tagsLoading}
        handleClearTags={handleClearTags}
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

ApplicationView.displayName = 'ApplicationsView';

export default ApplicationView;
