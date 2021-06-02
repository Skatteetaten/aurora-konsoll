import React from 'react';
import styled from 'styled-components';

export const StorytellerView = () => {
  return <StorytellerWrapper id="storyteller-attach"/>;
};

const StorytellerWrapper = styled.div`
  flex: 1;
  position: relative;
  overflow: auto;
  height: 100%;
`;
