import * as React from 'react';

import Icon from 'aurora-frontend-react-komponenter/Icon';
import styled, { css } from 'styled-components';

type IsActiveFunc = (data: IIconLinkData) => boolean;

function isActiveResolver(data: IIconLinkData, fn?: IsActiveFunc) {
  let isActive = false;
  if (fn) {
    isActive = fn(data);
  }

  return isActive;
}

export interface IIconLinkData {
  name: string;
  href: string;
  title: string;
}

interface IIconLinkProps extends IIconLinkData {
  isActiveHandler: IsActiveFunc;
  className?: string;
}

const IconLink: React.StatelessComponent<IIconLinkProps> = ({
  name,
  href,
  title,
  isActiveHandler,
  className
}) => {
  const icon = (
    <span className={className} title={title}>
      <Icon iconName={name} />
    </span>
  );

  const link = (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      {icon}
    </a>
  );

  const data = { name, href, title };
  return isActiveResolver(data, isActiveHandler) ? link : icon;
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
    ${({ href, name, title, isActiveHandler }) => {
      const data = { href, name, title };
      return (
        !isActiveResolver(data, isActiveHandler) &&
        css`
          cursor: default;
          color: #353535;
          opacity: 0.6;
        `
      );
    }};
  }
`;
