import * as React from 'react';

import DetailsList from 'aurora-frontend-react-komponenter/DetailsList';
import { SortDirection } from 'models/SortDirection';
import { createDate, dateValidation } from 'utils/date';

import { Selection } from 'office-ui-fabric-react/lib/DetailsList';

export interface ISortableDetailsListProps {
  columns: any[] | any;
  isHeaderVisible?: boolean;
  onColumnHeaderClick?: (
    ev: React.MouseEvent<HTMLElement, MouseEvent>,
    column: {
      key: number;
      fieldName: string;
    }
  ) => void;
  columnLength: number;
  viewItems: any[];
  defaultSortDirections: SortDirection[];
  filterView?: (filter: string) => (v: any) => boolean;
  filter: string;
  selection?: Selection;
}

export interface ISortableDetailsListState {
  columnSortDirections: SortDirection[];
  currentViewItems: any[];
  selectedColumnIndex: number;
}

class SortableDetailsList extends React.Component<
  ISortableDetailsListProps,
  ISortableDetailsListState
> {
  public state = {
    selectedColumnIndex: -1,
    currentViewItems: [],
    columnSortDirections: this.props.defaultSortDirections
  };

  // public componentDidMount() {
  //   this.setState({
  //     currentViewItems: this.props.viewItems
  //   });
  // }

  public componentDidUpdate(prevProps: ISortableDetailsListProps) {
    const { viewItems } = this.props;
    const { currentViewItems } = this.state;
    if (
      viewItems !== prevProps.viewItems ||
      (!(currentViewItems.length > 0) && viewItems.length > 0)
    ) {
      this.setState({
        currentViewItems: viewItems
      });
    }
  }

  public createColumns<T>(index: number, sortDirection: SortDirection): T[] {
    const columns = this.props.columns();
    if (index > -1) {
      const currentCol = columns[index];
      if (
        sortDirection === SortDirection.NONE ||
        sortDirection === SortDirection.DESC
      ) {
        currentCol.iconName = 'Down';
      } else if (sortDirection === SortDirection.ASC) {
        currentCol.iconName = 'Up';
      }
    }
    return columns;
  }

  public sortByColumn = (
    ev: React.MouseEvent<HTMLElement>,
    column: {
      key: number;
      fieldName: string;
    }
  ): void => {
    const { columnSortDirections } = this.state;
    const name = column.fieldName! as keyof any;
    const newSortDirections = this.props.defaultSortDirections;
    const prevSortDirection = columnSortDirections[column.key];

    if (this.sortNextAscending(prevSortDirection)) {
      newSortDirections[column.key] = SortDirection.ASC;
    } else if (prevSortDirection === SortDirection.ASC) {
      newSortDirections[column.key] = SortDirection.DESC;
    }

    const sortedItems = this.sortItems(
      this.props.viewItems,
      prevSortDirection,
      name
    );
    this.setState({
      currentViewItems: sortedItems,
      columnSortDirections: newSortDirections,
      selectedColumnIndex: column.key
    });
  };

  public filteredItems<T>(filter: string, viewItems: T[]): T[] {
    if (this.props.filterView) {
      return viewItems.filter(this.props.filterView(filter));
    } else {
      return viewItems;
    }
  }

  public sortItems<T>(
    viewItems: T[],
    prevSortDirection: SortDirection,
    name: string | number | symbol
  ): T[] {
    return viewItems.slice(0).sort((a: any, b: any) => {
      const valueA = this.lowerCaseIfString(a[name]);
      const valueB = this.lowerCaseIfString(b[name]);
      if (valueA === valueB) {
        return 0;
      } else if (dateValidation(valueA) || dateValidation(valueB)) {
        const dateA = createDate(valueA).getTime();
        const dateB = createDate(valueB).getTime();
        return this.sortNextAscending(prevSortDirection)
          ? dateB - dateA
          : dateA - dateB;
      } else {
        return (this.sortNextAscending(prevSortDirection)
        ? valueA < valueB
        : valueA > valueB)
          ? 1
          : -1;
      }
    });
  }

  public render() {
    const { filter, isHeaderVisible = false, selection } = this.props;
    const {
      columnSortDirections,
      currentViewItems,
      selectedColumnIndex
    } = this.state;
    return (
      <DetailsList
        columns={this.createColumns(
          selectedColumnIndex,
          columnSortDirections[selectedColumnIndex]
        )}
        items={this.filteredItems(filter, currentViewItems)}
        isHeaderVisible={isHeaderVisible}
        onColumnHeaderClick={this.sortByColumn}
        selection={selection}
      />
    );
  }
  private sortNextAscending(sortDirection: SortDirection): boolean {
    return (
      sortDirection === SortDirection.NONE ||
      sortDirection === SortDirection.DESC
    );
  }

  private lowerCaseIfString(value: any) {
    return typeof value === 'string' ? (value as string).toLowerCase() : value;
  }
}

export default SortableDetailsList;
