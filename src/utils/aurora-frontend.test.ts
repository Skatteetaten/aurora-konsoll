import { toComboBoxOptions } from 'utils/aurora-frontend';

describe('aurora-frontend', () => {
  it('removes duplicates and sorts dropdown options from names', () => {
    const comboboxOptions = toComboBoxOptions([
      'name3',
      'NAME1',
      'name1',
      'name2'
    ]);

    expect(comboboxOptions).toHaveLength(3);
    expect(comboboxOptions[0]).toEqual({ key: 'name1', text: 'name1' });
    expect(comboboxOptions[1]).toEqual({ key: 'name2', text: 'name2' });
    expect(comboboxOptions[2]).toEqual({ key: 'name3', text: 'name3' });
  });
});
