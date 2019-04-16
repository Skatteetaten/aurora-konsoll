import * as React from 'react';

import DetailsList from 'aurora-frontend-react-komponenter/DetailsList';
import { SortDirection } from 'models/SortDirection';
import { createDate, dateValidation } from 'utils/date';

import {
  CheckboxVisibility,
  Selection,
  SelectionMode
} from 'office-ui-fabric-react/lib/DetailsList';

export let selectedIndices: number[] = [];

export interface ISortableDetailsListProps {
  columns: () => any[];
  isHeaderVisible?: boolean;
  onColumnHeaderClick?: (
    ev: React.MouseEvent<HTMLElement, MouseEvent>,
    column: {
      key: number;
      fieldName: string;
    }
  ) => void;
  viewItems: any[];
  filterView: (filter: string) => (v: any) => boolean;
  filter: string;
  selection?: Selection;
  selectionMode?: SelectionMode;
  checkboxVisibility?: CheckboxVisibility;
  affiliation?: string;
  fetchedItems?: any[];
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

  public defaultSortDirections: SortDirection[] = new Array<SortDirection>(
    this.props.columns().length
  ).fill(SortDirection.NONE);

  public componentDidMount() {
    this.setState({
      columnSortDirections: this.defaultSortDirections
    });
  }

  public componentDidUpdate(prevProps: ISortableDetailsListProps) {
    const {
      viewItems,
      selection,
      filter,
      affiliation,
      fetchedItems
    } = this.props;
    const { currentViewItems, prevIndices } = this.state;

    const initialAffiliation = () =>
      prevProps.fetchedItems &&
      prevProps.fetchedItems.length === 0 &&
      fetchedItems &&
      fetchedItems.length > 0;

    if (selection) {
      this.updateCurrentSelection(
        selection,
        prevIndices,
        this.filteredItems(filter, currentViewItems)
      );
    }

    if (
      viewItems !== prevProps.viewItems ||
      (!(currentViewItems.length > 0) && viewItems.length > 0)
    ) {
      this.setState({
        currentViewItems: viewItems
      });
    }

    if (prevProps.affiliation !== affiliation || initialAffiliation()) {
      this.setState({
        columnSortDirections: this.defaultSortDirections,
        selectedColumnIndex: -1
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
    const newSortDirections = this.defaultSortDirections;
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
      selectedColumnIndex: column.key,
      prevIndices: selectedIndices
    });
  };
  public toViewIndex<T>(index: number, selection: Selection, items: T[]) {
    const listItem = items[index];
    return selection.getItems().findIndex(viewItem => viewItem === listItem);
  }

  public updateCurrentSelection<T>(
    selection: Selection,
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

  public toListIndex<T>(
    index: number,
    selection: Selection,
    items: T[]
  ): number {
    const viewItems = selection.getItems();
    const viewItem = viewItems[index];
    return items.findIndex(listItem => listItem === viewItem);
  }

  public currentSelection<T>(selection: Selection, items: T[]) {
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
