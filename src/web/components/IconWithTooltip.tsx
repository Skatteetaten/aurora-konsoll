import * as React from 'react';
import styled from 'styled-components';

import { Icon, Palette } from '@skatteetaten/frontend-components';

const { skeColor } = Palette;

interface IIconWithTooltip {
  content: string;
  className?: string;
  icon: string;
  iconStyle?: React.CSSProperties;
}

const IconWithTooltip = ({
  className,
  content,
  icon,
  iconStyle,
}: IIconWithTooltip) => {
  return (
    <div className={className}>
      <div className="position">
        <div className="tooltip" title="">
          <Icon iconName={icon} style={iconStyle} />
          <div className="tooltip-text">{content}</div>
        </div>
      </div>
    </div>
  );
};

export default styled(IconWithTooltip)`
  .position {
    position: relative;
  }

  .tooltip {
    position: absolute;
    display: inline;
    z-index: 100;
  }

  .tooltip .tooltip-text {
    position: absolute;
    white-space: pre-wrap;
    visibility: hidden;
    width: max-content;
    opacity: 0;
    background-color: ${skeColor.blackAlt};
    color: ${skeColor.white};
    padding: 8px;
    z-index: 1;
    top: 110%;
    box-shadow: 0px 0px 5px rgba(50, 50, 50, 0.75);
  }

  .tooltip:hover .tooltip-text {
    visibility: visible;
    opacity: 1;
    transition: all 0.3s;
  }
`;
