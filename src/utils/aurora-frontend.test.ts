import { toDropdownOptions } from './aurora-frontend';

describe('aurora-frontend', () => {

  it('removes duplicates and sorts dropdown options from names', () => {
    const dropdownOptions = toDropdownOptions(['name3', 'NAME1', 'name1', 'name2']);

    expect(dropdownOptions[0]).toEqual({key: 'name1', text: 'name1'});
    expect(dropdownOptions[1]).toEqual({key: 'name2', text: 'name2'});
    expect(dropdownOptions[2]).toEqual({key: 'name3', text: 'name3'});
  });

});
