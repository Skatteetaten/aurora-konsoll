import styled from 'styled-components';

interface IDetailsListColor {
  main: string;
  selected: string;
}

interface IDetailsListWrapperProps {
  mainIndex?: number;
  selectedIndex?: number;
  backgroundColor: {
    base: IDetailsListColor;
    hover: IDetailsListColor;
  };
}

const DetailsListWrapper = styled.div<IDetailsListWrapperProps>`
  [data-item-index] {
    &:hover, &:active, &:focus {
      color: black;
      background: #cde1f9;
    }
  }

  [data-item-index="${props => props.selectedIndex}"] {
    color: black;
    background: #8accff;

    &:hover, &:active, &:focus {
      background: #8accff;
    }
  }

  [data-item-index="${props => props.mainIndex}"] {
    color: black;
    background: ${({ mainIndex, selectedIndex }) =>
      mainIndex === selectedIndex ? '#e7b78a' : '#f9ede2'};

    &:hover, &:active, &:focus {
      background: #e7b78a;
    }
  }

  .ms-List-cell {
    cursor: pointer
  }

  .ms-DetailsRow-cell {
    padding: 0;
  }
`;

DetailsListWrapper.defaultProps = {
  backgroundColor: {
    base: {
      main: '#f9ede2',
      selected: '#8accff'
    },
    hover: {
      main: '#e7b78a',
      selected: '#8accff'
    }
  }
};

export default DetailsListWrapper;
