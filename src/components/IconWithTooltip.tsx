import * as React from 'react';
import styled from 'styled-components';

import ActionButton from 'aurora-frontend-react-komponenter/ActionButton';
import palette from 'aurora-frontend-react-komponenter/utils/palette';

interface IIconWithTooltip {
  content: string;
  className?: string;
  icon: string;
}

const IconWithTooltip = ({ className, content, icon }: IIconWithTooltip) => {
  return (
    <div className={className}>
      <div className="tooltip">
        <ActionButton
          icon={icon}
          color="red"
          title=""
          style={{
            margin: '-12px -20px -11px -9px',
            width: '10px',
            cursor: 'default'
          }}
        />
        <div className="tooltip-text">{content}</div>
      </div>
    </div>
  );
};

export default styled(IconWithTooltip)`
  .tooltip {
    position: absolute;
    display: inline-block;
    z-index: 100;
  }

  .tooltip .tooltip-text {
    position: absolute;
    white-space: pre-wrap;
    visibility: hidden;
    width: max-content;
    opacity: 0;
    background-color: ${palette.skeColor.blackAlt};
    color: ${palette.skeColor.white};
    padding: 8px;
    z-index: 1;
    top: 140%;
    left: 30%;
    box-shadow: 0px 0px 5px rgba(50, 50, 50, 0.75);
  }

  .tooltip:hover .tooltip-text {
    visibility: visible;
    opacity: 1;
    transition: all 0.3s;
  }
`;
