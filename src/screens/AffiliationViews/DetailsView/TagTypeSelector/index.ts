import { ImageTagType } from 'services/TagStateManager';
import TagTypeSelector from './TagTypeSelector';

export interface IImageTagTypeOption {
  key: ImageTagType;
  tag: ImageTagType;
  text: string;
  onRenderLabel?: (options: IImageTagTypeOption) => JSX.Element;
}

export default TagTypeSelector;
