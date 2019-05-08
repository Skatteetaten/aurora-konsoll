import * as React from 'react';
import styled from 'styled-components';

import { InfoContentValues } from 'models/InfoContentValues';

interface IInfoContentRow {
  value: string;
  link?: string;
}

interface IInfoContentProps {
  style?: React.CSSProperties;
  className?: string;
  id?: string;
  infoContentValues: InfoContentValues;
}

const defaultStyle: React.CSSProperties = {
  background: 'white'
};

const InfoContent = ({
  infoContentValues,
  className,
  id,
  style = defaultStyle
}: IInfoContentProps) => {
  const values = infoContentValues.get();
  return (
    <div className={className} style={style} id={id}>
      {Object.keys(values).map(k => {
        const content = values[k];
        if(typeof content === 'string') {
          return (
            <dl key={k}>
              <dt>{k}</dt>
              <dd title={content}>{content}</dd>
            </dl>
          )
        } else {
          return (
            <dl key={k}>
              <dt>{k}</dt>
              <dd title={content.value}><a href={content.link}>{content.value}</a></dd>
            </dl>
          )
        }
        })}
    </div>
  );
};

export default styled(InfoContent)`
  box-shadow: 0px 3px 8px 0px rgba(0, 0, 0, 0.2);
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
