import * as React from 'react';

import Icon from 'aurora-frontend-react-komponenter/Icon';
import styled, { css } from 'styled-components';

interface IIconLinkProps {
  name: string;
  href: string;
  title: string;
  className?: string;
}

const containsHttp = (href: string) => href.startsWith('http');

const IconLink = ({ name, href, title, className }: IIconLinkProps) => {
  const icon = (
    <span className={className} title={title}>
      <Icon iconName={name} />
    </span>
  );

  return !containsHttp(href) ? (
    icon
  ) : (
    <a href={href} target="_blank" className={className}>
      {icon}
    </a>
  );
};

export default styled(IconLink)`
  display: inherit;
  text-decoration: none;
  color: white;

  &:hover {
    color: #1362ae;
  }

  i {
    margin-left: 5px;
    cursor: pointer;
    font-size: 22px;
    ${props =>
      !containsHttp(props.href) &&
      css`
        cursor: default;
        color: gray;
        opacity: 0.6;
      `};
  }
`;
