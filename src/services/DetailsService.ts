import { IApplicationDeploymentDetails } from 'models/ApplicationDeployment';
import { IDeploymentSpec } from 'models/DeploymentSpec';
import { ITag, ITagsPaged, ITagsPagedGroup } from 'models/Tag';

export default class DetailsService {
  public findTagForDeploymentSpec = (
    tagsPagedGroup: ITagsPagedGroup,
    deploymentSpec?: IDeploymentSpec
  ): ITag | undefined => {
    if (!deploymentSpec) {
      return undefined;
    }
    return Object.keys(tagsPagedGroup).reduce(
      (acc: ITag | undefined, key: string) => {
        if (acc) {
          return acc;
        }
        const tag = (tagsPagedGroup[key] as ITagsPaged).tags.find(
          it => it.name === deploymentSpec.version
        );
        return tag;
      },
      undefined
    );
  };

  public hasRecivedTagsAndVersion = (
    tagsPagedGroup: ITagsPagedGroup,
    deploymentDetails: IApplicationDeploymentDetails
  ): boolean => {
    return (
      !!deploymentDetails.deploymentSpec &&
      !!deploymentDetails.deploymentSpec.version &&
      (tagsPagedGroup.auroraVersion.tags.length > 0 ||
        tagsPagedGroup.bugfix.tags.length > 0 ||
        tagsPagedGroup.commitHash.tags.length > 0 ||
        tagsPagedGroup.latest.tags.length > 0 ||
        tagsPagedGroup.major.tags.length > 0 ||
        tagsPagedGroup.minor.tags.length > 0 ||
        tagsPagedGroup.snapshot.tags.length > 0)
    );
  };
}
