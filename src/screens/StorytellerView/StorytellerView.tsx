import React from 'react';
import styled from 'styled-components';

export const StorytellerView = () => {
  return <StorytellerWrapper id="storyteller-attach"></StorytellerWrapper>;
};

const StorytellerWrapper = styled.div`
  flex: 1;
  position: relative;
  overflow: auto;
`;
