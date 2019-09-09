import { IComboBoxOption } from 'aurora-frontend-react-komponenter/ComboBox';

function toComboBoxOptions(names: string[]): IComboBoxOption[] {
  const comboBoxNames = names
    .map(name => name.toLowerCase())
    .filter((name, index, self) => self.indexOf(name) === index)
    .sort()
    .reduce(
      (acc: IComboBoxOption[], name) => [
        ...acc,
        {
          key: name,
          text: name
        }
      ],
      []
    );
  return [...comboBoxNames];
}

export { toComboBoxOptions };
