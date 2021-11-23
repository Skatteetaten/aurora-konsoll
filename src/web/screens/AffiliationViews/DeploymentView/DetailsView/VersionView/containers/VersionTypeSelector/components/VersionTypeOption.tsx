import React from 'react';
import { IRenderFunction, ISelectableOption } from '@fluentui/react';
import styled from 'styled-components';

export const onRenderOption: IRenderFunction<ISelectableOption> = (item) => {
  if (!item) {
    return null;
  }

  const option = item.text;
  return (
    <StyledOptions>
      <div className="bold-options">{option.split('-').slice(0, 1)}</div>
      {option.split(/(?=-)/g).slice(1, 2)}
    </StyledOptions>
  );
};

const StyledOptions = styled.div`
  display: inline-flex;
  white-space: pre-wrap;
  margin: 10px 0 10px 0;
  .bold-options {
    font-weight: bold;
  }
`;
