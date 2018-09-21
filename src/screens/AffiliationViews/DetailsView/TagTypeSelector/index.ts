import { ImageTagType } from 'models/TagsPagedGroup';
import TagTypeSelector from './TagTypeSelector';

export interface IVersionStrategyOption {
  key: ImageTagType;
  tag: ImageTagType;
  text: string;
  onRenderLabel?: (options: IVersionStrategyOption) => JSX.Element;
}

export default TagTypeSelector;
