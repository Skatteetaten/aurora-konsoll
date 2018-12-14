import styled from 'styled-components';

interface IDetailsListColors {
  base: string;
  hover: string;
}

interface IDetailsListWrapperProps {
  marked: {
    main: number;
    selected: number;
  };
  colors: {
    main: IDetailsListColors;
    selected: IDetailsListColors;
    default: IDetailsListColors;
  };
}

const DetailsListWrapper = styled.div<IDetailsListWrapperProps>`
  [data-item-index] {
    &:hover, &:active, &:focus {
      color: black;
      background: ${props => props.colors.default.base};
    }
  }

  [data-item-index="${props => props.marked.selected}"] {
    color: black;
      background: ${props => props.colors.selected.base};

    &:hover, &:active, &:focus {
      background: ${props => props.colors.selected.hover};
    }
  }

  [data-item-index="${props => props.marked.main}"] {
    color: black;
    background: ${({ marked, colors }) =>
      marked.main === marked.selected ? colors.main.hover : colors.main.base};

    &:hover, &:active, &:focus {
      background: ${props => props.colors.main.hover};
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
  marked: {
    main: -1,
    selected: -1
  },
  colors: {
    main: {
      base: '#f9ede2',
      hover: '#e7b78a'
    },
    selected: {
      base: '#8accff',
      hover: '#8accff'
    },
    default: {
      base: '#cde1f9',
      hover: '#cde1f9'
    }
  }
};

export default DetailsListWrapper;
