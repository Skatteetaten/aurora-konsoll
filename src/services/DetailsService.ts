import {
  IApplicationDeployment,
  IApplicationDeploymentDetails
} from 'models/ApplicationDeployment';
import { ImageTagType } from 'models/ImageTagType';
import { ITag, ITagsPagedGroup } from 'models/Tag';

export default class DetailsService {
  public findTagTypeWithVersion = (
    tagsPagedGroup: ITagsPagedGroup,
    deploymentDetails: IApplicationDeploymentDetails
  ) => {
    const isCorrentVersion = (it: ITag) =>
      deploymentDetails.deploymentSpec &&
      it.name === deploymentDetails.deploymentSpec.version;
    if (
      tagsPagedGroup.auroraSnapshotVersion.tags.filter(isCorrentVersion)
        .length > 0
    ) {
      return ImageTagType.AURORA_SNAPSHOT_VERSION;
    } else if (
      tagsPagedGroup.auroraVersion.tags.filter(isCorrentVersion).length > 0
    ) {
      return ImageTagType.AURORA_VERSION;
    } else if (tagsPagedGroup.bugfix.tags.filter(isCorrentVersion).length > 0) {
      return ImageTagType.BUGFIX;
    } else if (
      tagsPagedGroup.commitHash.tags.filter(isCorrentVersion).length > 0
    ) {
      return ImageTagType.COMMIT_HASH;
    } else if (tagsPagedGroup.latest.tags.filter(isCorrentVersion).length > 0) {
      return ImageTagType.LATEST;
    } else if (tagsPagedGroup.major.tags.filter(isCorrentVersion).length > 0) {
      return ImageTagType.MAJOR;
    } else if (tagsPagedGroup.minor.tags.filter(isCorrentVersion).length > 0) {
      return ImageTagType.MINOR;
    } else if (
      tagsPagedGroup.snapshot.tags.filter(isCorrentVersion).length > 0
    ) {
      return ImageTagType.SNAPSHOT;
    } else {
      return ImageTagType.AURORA_SNAPSHOT_VERSION;
    }
  };

  public deployTag = (
    deploymentDetails: IApplicationDeploymentDetails,
    deployment: IApplicationDeployment,
    selectedTagType: ImageTagType
  ): ITag => {
    if (deploymentDetails.deploymentSpec && deployment.version.releaseTo) {
      return {
        name: deploymentDetails.deploymentSpec.version,
        lastModified: '',
        type: selectedTagType
      };
    } else {
      return deployment.version.deployTag;
    }
  };

  public hasRecivedTagsAndVersion = (
    tagsPagedGroup: ITagsPagedGroup,
    deploymentDetails: IApplicationDeploymentDetails
  ) => {
    return (
      deploymentDetails.deploymentSpec &&
      deploymentDetails.deploymentSpec.version &&
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
