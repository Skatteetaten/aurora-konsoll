import * as React from 'react';

import Icon from '@skatteetaten/frontend-components/Icon';
import styled, { css } from 'styled-components';
import palette from '@skatteetaten/frontend-components/utils/palette';

const { skeColor } = palette;

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
  iconStyle: React.CSSProperties;
}

const IconLink: React.StatelessComponent<IIconLinkProps> = ({
  name,
  href,
  title,
  isActiveHandler,
  className,
  iconStyle,
}) => {
  const icon = (
    <span className={className} title={title}>
      <Icon iconName={name} style={iconStyle} />
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
  color: ${skeColor.blue};

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
          color: ${skeColor.lightGrey};
          opacity: 0.6;
        `
      );
    }};
  }
`;
