import {
  IApplicationDeployment,
  IUserAndAffiliations
} from 'models/ApplicationDeployment';
import { queryCreator } from '../../GraphQLRestMapper';
import {
  APPLICATIONS_QUERY,
  IApplicationsConnectionQuery,
  IUserAffiliationsQuery,
  USER_AFFILIATIONS_QUERY
} from './query';

function findDeployTagForTemplate(applicationName: string, deployTag: string) {
  const templates = {
    'aurora-activemq-1.0.0': '2',
    'aurora-redis-1.0.0': '3.2.3',
    'aurora-wiremock-1.0.0': '1.3.0',
    redis: '3.2.3',
    wiremock: '1.3.0'
  };

  return deployTag ? deployTag : templates[applicationName] || deployTag;
}

const getUserAndAffiliations = queryCreator<
  IUserAffiliationsQuery,
  IUserAndAffiliations
>(USER_AFFILIATIONS_QUERY, data => ({
  affiliations: data.affiliations.edges.map(edge => edge.node.name),
  user: data.currentUser.name
}));

const getAllApplicationDeployments = queryCreator<
  IApplicationsConnectionQuery,
  IApplicationDeployment[]
>(
  APPLICATIONS_QUERY,
  data =>
    data.applications.edges.reduce((acc, { node }) => {
      const { applicationDeployments, imageRepository } = node;
      const deployments = applicationDeployments.map(app => ({
        affiliation: app.affiliation.name,
        environment: app.environment,
        id: app.id,
        name: app.name,
        permission: app.namespace.permission,
        repository: imageRepository ? imageRepository.repository : '',
        status: {
          code: app.status.code,
          reasons: app.status.reasons,
          reports: app.status.reports
        },
        time: app.time,
        version: {
          releaseTo: app.version.releaseTo,
          auroraVersion: app.version.auroraVersion,
          deployTag: {
            lastModified: '',
            name: findDeployTagForTemplate(
              node.name,
              app.version.deployTag.name
            ),
            type: app.version.deployTag.type
          }
        }
      }));
      return [...acc, ...deployments];
    }, []),
  params => ({
    affiliations: [params.affiliation]
  })
);

export { getUserAndAffiliations, getAllApplicationDeployments };
