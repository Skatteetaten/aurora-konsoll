import * as React from 'react';

import DetailsList, {
  DetailsListProps
} from '@skatteetaten/frontend-components/DetailsList';
import { SortDirection } from 'models/SortDirection';
import { createDate, dateValidation } from 'utils/date';

import * as util from 'util';
import {
  CheckboxVisibility,
  ISelection,
  SelectionMode,
  IColumn
} from 'office-ui-fabric-react/lib-commonjs';

export let selectedIndices: number[] = [];

export interface ISortableDetailsListProps extends DetailsListProps {
  filterView: (filter: string) => (v: any) => boolean;
  filter: string;
  shouldResetSort?: boolean;
  onResetSort?: () => void;
  passItemsToParentComp?: (items: any[]) => void;
}

export interface ISortableDetailsListState {
  columnSortDirections: SortDirection[];
  currentViewItems: any[];
  selectedColumnIndex: number;
  prevIndices: number[];
}

class SortableDetailsList extends React.Component<
  ISortableDetailsListProps,
  ISortableDetailsListState
> {
  public state = {
    selectedColumnIndex: -1,
    currentViewItems: [],
    columnSortDirections: [],
    prevIndices: []
  };

  public createDefaultSortDirections: () => SortDirection[] = () =>
    new Array<SortDirection>(
      this.props.columns ? this.props.columns.length : 0
    ).fill(SortDirection.NONE);

  public componentDidMount() {
    this.setState({
      columnSortDirections: this.createDefaultSortDirections()
    });
  }

  public componentDidUpdate(prevProps: ISortableDetailsListProps) {
    const {
      selection,
      filter,
      items,
      shouldResetSort,
      onResetSort,
      passItemsToParentComp
    } = this.props;
    const { currentViewItems, prevIndices } = this.state;
    if (selection) {
      this.updateCurrentSelection(
        selection,
        prevIndices,
        this.filteredItems(filter, currentViewItems)
      );
    }

    if (
      items !== prevProps.items ||
      (!(currentViewItems.length > 0) && items.length > 0)
    ) {
      this.setState({
        currentViewItems: items
      });
    }

    if (shouldResetSort) {
      if (onResetSort) {
        onResetSort();
      }
      this.resetColumns();
      this.setState({
        columnSortDirections: this.createDefaultSortDirections(),
        selectedColumnIndex: -1
      });
    }

    if (
      passItemsToParentComp &&
      util.inspect(items) === util.inspect(prevProps.items)
    ) {
      if (items.length !== currentViewItems.length) {
        passItemsToParentComp(items);
      } else {
        passItemsToParentComp(currentViewItems);
      }
    }
  }

  public resetColumns() {
    const { columns } = this.props;
    if (columns) {
      columns.forEach(col => (col.iconName = ''));
    }
  }

  public componentWillUnmount() {
    this.resetColumns();
  }

  public createColumns(index: number, sortDirection: SortDirection): IColumn[] {
    const { columns } = this.props;
    if (!columns) {
      return [];
    }

    if (index > -1) {
      // Reset icons, only one column should be sortet at the time.
      this.resetColumns();
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

  public sortByColumn: DetailsListProps['onColumnHeaderClick'] = (
    ev,
    column
  ): void => {
    const { columnSortDirections } = this.state;
    const { items } = this.props;

    if (!column) {
      return;
    }

    const name = column.fieldName! as keyof any;
    const newSortDirections = this.createDefaultSortDirections();
    const prevSortDirection = columnSortDirections[column.key];

    if (this.sortNextAscending(prevSortDirection)) {
      newSortDirections[column.key] = SortDirection.ASC;
    } else if (prevSortDirection === SortDirection.ASC) {
      newSortDirections[column.key] = SortDirection.DESC;
    }

    const sortedItems = this.sortItems(items, prevSortDirection, name);
    this.setState({
      currentViewItems: sortedItems,
      columnSortDirections: newSortDirections,
      selectedColumnIndex: Number(column.key),
      prevIndices: selectedIndices
    });
  };
  public toViewIndex<T>(index: number, selection: ISelection, items: T[]) {
    const listItem = items[index];
    return selection.getItems().findIndex(viewItem => viewItem === listItem);
  }

  public updateCurrentSelection<T>(
    selection: ISelection,
    prevIndices: number[],
    items: T[]
  ): void {
    const intersection = prevIndices.filter(element =>
      selectedIndices.includes(element)
    );

    if (prevIndices.length > 0) {
      for (const i of prevIndices) {
        if (!intersection.includes(i) && selection.isIndexSelected(i)) {
          selection.setIndexSelected(i, false, false);
        }
      }
    }

    const indices = selectedIndices
      .map(index => this.toViewIndex(index, selection, items))
      .filter(index => index !== -1);

    for (const i of indices) {
      if (!intersection.includes(i)) {
        selection.setIndexSelected(i, true, false);
      }
    }
  }

  public filteredItems<T>(filter: string, viewItems: T[]): T[] {
    const { filterView } = this.props;
    if (filterView) {
      return viewItems.filter(filterView(filter));
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

  public toListIndex<T>(
    index: number,
    selection: ISelection,
    items: T[]
  ): number {
    const viewItems = selection.getItems();
    const viewItem = viewItems[index];
    return items.findIndex(listItem => listItem === viewItem);
  }

  public currentSelection<T>(selection: ISelection, items: T[]) {
    const newIndices = selection
      .getSelectedIndices()
      .map(index => this.toListIndex(index, selection, items))
      .filter(index => selectedIndices.indexOf(index) === -1);

    const unselectedIndices = selection
      .getItems()
      .map((item, index) => index)
      .filter(index => selection.isIndexSelected(index) === false)
      .map(index => this.toListIndex(index, selection, items));

    selectedIndices = selectedIndices.filter(
      index => unselectedIndices.indexOf(index) === -1
    );
    selectedIndices = [...selectedIndices, ...newIndices];
  }

  public render() {
    const {
      filter,
      isHeaderVisible = false,
      selection,
      selectionMode = SelectionMode.single,
      checkboxVisibility = CheckboxVisibility.hidden
    } = this.props;
    const {
      columnSortDirections,
      currentViewItems,
      selectedColumnIndex
    } = this.state;

    if (selection) {
      this.currentSelection(
        selection,
        this.filteredItems(filter, currentViewItems)
      );
    }

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
        selectionMode={selectionMode}
        checkboxVisibility={checkboxVisibility}
      />
    );
  }
  private sortNextAscending(sortDirection: SortDirection): boolean {
    return (
      sortDirection === SortDirection.NONE ||
      sortDirection === SortDirection.DESC
    );
  }

  private lowerCaseIfString(value: any): any {
    return typeof value === 'string' ? (value as string).toLowerCase() : value;
  }
}

export default SortableDetailsList;
