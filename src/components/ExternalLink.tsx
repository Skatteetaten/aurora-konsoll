import styled from 'styled-components';

export const ExternalLink = styled.a`
  color: rgba(19, 98, 174, 1);
  text-decoration: none;
  padding-bottom: 1px;
  border-bottom: 2px solid rgba(19, 98, 174, 0.25);
  transition: border-color 0.5s;

  :hover,
  :focus {
    outline: none;
    border-color: rgba(19, 98, 174, 1);
    transition: border-color 0.5s;
  }
`;
