import { shallow } from 'enzyme';
import * as React from 'react';
import { FooterText } from './FooterText';

describe('FooterText', () => {
  it('should display filter name when default exists', () => {
    const wrapper = shallow(<FooterText filter="paas-filter" />);
    const text = wrapper.find('div').text();
    expect(text).toContain('paas-filter');
  });

  it('should not display filter name when no default exists', () => {
    const wrapper = shallow(<FooterText />);
    const text = wrapper.find('div').text();
    expect(text).not.toContain('paas-filter');
  });
});
