import * as React from 'react';
import styled from 'styled-components';

interface IInfoContentProps {
  className?: string;
  values: {
    [key: string]: any;
  };
}

const InfoContent = ({ values, className }: IInfoContentProps) => (
  <div className={className}>
    <div className="g-content">
      <div className="g-keys">
        {Object.keys(values).map(k => (
          <p key={k}>{k}</p>
        ))}
      </div>
      <div className="g-values">
        {Object.keys(values).map(k => (
          <p key={k} title={values[k]}>
            {values[k]}
          </p>
        ))}
      </div>
    </div>
  </div>
);

export default styled(InfoContent)`
  max-width: 650px;
  box-shadow: 0px 3px 8px 0px rgba(0, 0, 0, 0.2);
  background: white;

  .g-content {
    display: grid;
    padding: 5px 10px;
    grid-template-areas: 'keys values';
    grid-template-columns: 1fr 2fr;
  }

  .g-keys {
    white-space: nowrap;
    padding-right: 10px;
    grid-area: keys;
    p {
      margin: 10px 0;
      font-weight: bold;
    }
  }

  .g-values {
    overflow: hidden;
    white-space: nowrap;
    grid-area: values;
    p,
    a {
      display: block;
      margin: 10px 0;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
`;
