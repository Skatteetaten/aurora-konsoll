import { ImageTagType } from 'models/ImageTagType';

// TODO: Remove when ApplicationDeployment is available in store.
export interface ITag {
  name: string;
  type: ImageTagType;
  lastModified?: string;
}
