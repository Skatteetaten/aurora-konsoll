import { Component } from 'react';

import { IAuroraApiComponentProps } from 'components/AuroraApi';
import {
  IApplicationDeployment,
  IApplicationDeploymentDetails
} from 'models/ApplicationDeployment';
import {
  IUnavailableServiceMessage,
  unavailableServiceMessageCreator
} from 'models/UnavailableServiceMessage';
import { ApplicationDeploymentDetailsRoute } from '../ApplicationDeploymentSelector';

export interface IDetailsViewProps
  extends ApplicationDeploymentDetailsRoute,
    IAuroraApiComponentProps {
  deployment: IApplicationDeployment;
  getAllApplicationDeployments: (affiliation: string) => void;
  filterPathUrl: string;
  findApplicationDeploymentDetails: (id: string) => void;
  deploymentDetails: IApplicationDeploymentDetails;
  refreshApplicationDeployment: (
    applicationDeploymentId: string,
    affiliation: string
  ) => void;
  refreshApplicationDeployments: () => void;
  deleteApplicationDeployment: (namespace: string, name: string) => void;
  isRefreshingApplicationDeployment: boolean;
  isFetchingDetails: boolean;
  affiliation: string;
  isApplicationDeploymentDeleted: boolean;
}

export type DetailsViewComponent = Component<IDetailsViewProps>;

export default class DetailsViewController {
  private component: DetailsViewComponent;

  constructor(component: DetailsViewComponent) {
    this.component = component;
  }

  public refreshApplicationDeployment = async () => {
    const {
      deployment,
      refreshApplicationDeployment,
      affiliation
    } = this.component.props;
    await refreshApplicationDeployment(deployment.id, affiliation);
  };

  public goToDeploymentsPage = () => {
    const { match, history, filterPathUrl } = this.component.props;
    history.push(`/a/${match.params.affiliation}/deployments/${filterPathUrl}`);
  };

  public onMount = () => {
    const { id } = this.component.props.deployment;
    const { findApplicationDeploymentDetails } = this.component.props;

    findApplicationDeploymentDetails(id);
  };

  public getVersionViewUnavailableMessage():
    | IUnavailableServiceMessage
    | undefined {
    const { deploymentDetails } = this.component.props;
    const { deploymentSpec } = deploymentDetails;

    const serviceUnavailableBecause = unavailableServiceMessageCreator(
      'Det er ikke mulig å endre versjonen på denne applikasjonen'
    );

    if (deploymentSpec && deploymentSpec.type === 'development') {
      return serviceUnavailableBecause(
        'Applikasjonen er av type development, og kan kun oppgraderes med binary builds'
      );
    }

    return undefined;
  }
}
