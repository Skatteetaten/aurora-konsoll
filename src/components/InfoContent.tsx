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
    {Object.keys(values).map(k => (
      <dl key={k}>
        <dt>{k}</dt>
        <dd title={values[k]}>{values[k]}</dd>
      </dl>
    ))}
  </div>
);

export default styled(InfoContent)`
  max-width: 650px;
  box-shadow: 0px 3px 8px 0px rgba(0, 0, 0, 0.2);
  background: white;
  padding: 5px 10px;

  dl {
    display: flex;
    margin: 15px 0;
  }

  dl dt {
    flex: 1;
    font-weight: 600;
    margin-right: 30px;
    min-width: 130px;
  }

  dl dd {
    flex: 4;
    margin: 0;
    word-break: break-all;
  }
`;
