import * as React from 'react';
import styled from 'styled-components';

import palette from '@skatteetaten/frontend-components/utils/palette';
import { getLocalDatetime } from 'utils/date';
import { DateTime } from 'luxon';
interface DateDisplayProps {
  date: string;
  className?: string;
  position: 'bottom' | 'left';
}

const DateDisplay = ({ date, className, position }: DateDisplayProps) => {
  return (
    <div className={className}>
      <div className="tooltip position" title="">
        {getLocalDatetime(date)}
        <div className={`tooltip-text ${position}`}>
          Tiden vises i lokal tid. Full ISO 8601 dato: <br />
          {DateTime.fromISO(date).toISO()}
        </div>
      </div>
    </div>
  );
};

export default styled(DateDisplay)`

display: inline-block;


  .position {
    position: relative;
    z-index: 100;
    width: fit-content;
  }

  .tooltip .tooltip-text {
    white-space: pre-wrap;
    visibility: hidden;
    width: max-content;
    opacity: 0;
    background-color: ${palette.skeColor.blackAlt};
    color: ${palette.skeColor.white};
    padding: 8px;
    z-index: 1
    display: none;
    position: absolute;
    box-shadow: 0px 0px 5px rgba(50, 50, 50, 0.75);
  }

  .tooltip:hover .tooltip-text {
    visibility: visible;
    opacity: 1;
    transition: all 1s;
  }

  .left {
    top: -20px;
    right: 100%;
  }

  .bottom {
    top: 105%;
  }
`;
