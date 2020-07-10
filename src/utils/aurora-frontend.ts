import { IDropdownOption } from 'office-ui-fabric-react/lib-commonjs';

function toDropdownOptions(names: string[]): IDropdownOption[] {
  const dropdownNames = names
    .map(name => name.toLowerCase())
    .filter((name, index, self) => self.indexOf(name) === index)
    .sort()
    .reduce(
      (acc: IDropdownOption[], name) => [
        ...acc,
        {
          key: name,
          text: name
        }
      ],
      []
    );
  return [{ key: 'Ingen', text: '' }, ...dropdownNames];
}

export { toDropdownOptions };
