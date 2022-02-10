import * as React from 'react';
import { useEffect, useRef, useState } from 'react';

import { DetailsList } from '@skatteetaten/frontend-components/DetailsList';
import { DetailsListProps } from '@skatteetaten/frontend-components/DetailsList/DetailsList.types';
import { CheckboxVisibility, IColumn, SelectionMode } from '@fluentui/react';
import { SortDirection } from 'web/models/SortDirection';
import { createDate, dateValidation } from 'web/utils/date';

import { inspect } from 'util';

export let selectedIndices: number[] = [];

export interface ISortableDetailsListProps extends DetailsListProps {
  filterView: (filter: string) => (v: any) => boolean;
  filter: string;
  shouldResetSort?: boolean;
  onResetSort?: () => void;
  passItemsToParentComp?: (items: any[]) => void;
  isRefreshing?: boolean;
  selectedItems?: any[];
}

const createDefaultSortDirections = (columns?: IColumn[]) =>
  new Array<SortDirection>(columns ? columns.length : 0).fill(
    SortDirection.NONE
  );

const sortNextAscending = (sortDirection: SortDirection): boolean =>
  sortDirection === SortDirection.NONE || sortDirection === SortDirection.DESC;
const lowerCaseIfString = (value: any): any =>
  typeof value === 'string' ? (value as string).toLowerCase() : value;

const SortableDetailsList: React.FC<ISortableDetailsListProps> = ({
  filterView,
  filter,
  shouldResetSort,
  onResetSort,
  passItemsToParentComp,
  isHeaderVisible,
  selection,
  checkboxVisibility = CheckboxVisibility.hidden,
  columns,
  items,
  isRefreshing,
  selectedItems,
}) => {
  const [selectedColumnIndex, setSelectedColumnIndex] = useState(-1);
  const [currentViewItems, setCurrentViewItems] = useState<any[]>([]);

  const sortDirections = createDefaultSortDirections(columns);

  const [columnSortDirections, setColumnSortDirections] =
    useState<SortDirection[]>(sortDirections);
  const previousColumnSortDirectionsRef = useRef<SortDirection[]>();
  useEffect(() => {
    previousColumnSortDirectionsRef.current = columnSortDirections;
  });

  const previousColumnSortDirections = previousColumnSortDirectionsRef.current;

  useEffect(() => {
    if (
      selection &&
      selectedItems &&
      inspect(previousColumnSortDirections) !== inspect(columnSortDirections)
    ) {
      selection?.setAllSelected(false);
      const selectionItems = selection.getItems();

      selectionItems
        .filter((item) =>
          selectedItems?.some(
            (selectedItem) =>
              inspect(selectedItem as any) === inspect(item as any)
          )
        )
        .map((selectedItem) => selectionItems.indexOf(selectedItem))
        .forEach((previousSelectedItemIndex) => {
          selection.setIndexSelected(previousSelectedItemIndex, true, false);
        });
    }
  }, [
    columnSortDirections,
    selectedItems,
    selection,
    previousColumnSortDirections,
  ]);

  const resetColumns = () => {
    if (columns) {
      columns.forEach((col) => (col.isSorted = false));
    }
  };

  useEffect(() => {
    if (shouldResetSort) {
      if (onResetSort) {
        onResetSort();
      }
      if (columns) {
        columns.forEach((col) => (col.isSorted = false));
      }
      const directions = createDefaultSortDirections(columns);

      setColumnSortDirections(directions);
      setSelectedColumnIndex(-1);
    }
  }, [shouldResetSort, onResetSort, columns]);

  useEffect(() => {
    if (passItemsToParentComp) {
      if (items.length !== currentViewItems.length) {
        passItemsToParentComp(items);
      } else {
        passItemsToParentComp(currentViewItems);
      }
    }
  }, [isRefreshing, passItemsToParentComp, items, currentViewItems]);

  useEffect(() => {
    setCurrentViewItems(items);
  }, [items]);

  const createColumns = (
    index: number,
    sortDirection: SortDirection
  ): IColumn[] => {
    if (!columns) {
      return [];
    }

    if (index > -1) {
      // Reset icons, only one column should be sortet at the time.
      resetColumns();
      const currentCol = columns[index];
      currentCol.isSorted = true;
      if (
        sortDirection === SortDirection.NONE ||
        sortDirection === SortDirection.DESC
      ) {
        currentCol.isSortedDescending = true;
      } else if (sortDirection === SortDirection.ASC) {
        currentCol.isSortedDescending = false;
      }
    }
    return columns;
  };

  const filteredItems = (filter: string, viewItems: any[]): any[] =>
    filterView ? viewItems.filter(filterView(filter.toLowerCase())) : viewItems;

  const sortByColumn: DetailsListProps['onColumnHeaderClick'] = (
    ev,
    column
  ): void => {
    if (!column) {
      return;
    }

    const name = column.fieldName! as keyof any;
    const newSortDirections = createDefaultSortDirections(columns);
    const prevSortDirection = columnSortDirections[column.key];

    if (sortNextAscending(prevSortDirection)) {
      newSortDirections[column.key] = SortDirection.ASC;
    } else if (prevSortDirection === SortDirection.ASC) {
      newSortDirections[column.key] = SortDirection.DESC;
    }

    const sortedItems = sortItems(items, prevSortDirection, name);
    setCurrentViewItems(sortedItems);
    setColumnSortDirections(newSortDirections);
    setSelectedColumnIndex(Number(column.key));
  };

  const sortItems = (
    viewItems: any[],
    prevSortDirection: SortDirection,
    name: string | number | symbol
  ): any[] =>
    viewItems.slice(0).sort((a: any, b: any) => {
      const valueA = lowerCaseIfString(a[name]);
      const valueB = lowerCaseIfString(b[name]);
      if (valueA === valueB) {
        return 0;
      } else if (dateValidation(valueA) || dateValidation(valueB)) {
        const dateA = createDate(valueA).getTime();
        const dateB = createDate(valueB).getTime();
        return sortNextAscending(prevSortDirection)
          ? dateB - dateA
          : dateA - dateB;
      } else {
        return (
          sortNextAscending(prevSortDirection)
            ? valueA < valueB
            : valueA > valueB
        )
          ? 1
          : -1;
      }
    });
  return (
    <DetailsList
      columns={createColumns(
        selectedColumnIndex,
        columnSortDirections[selectedColumnIndex]
      )}
      items={filteredItems(filter, currentViewItems)}
      isHeaderVisible={isHeaderVisible}
      onColumnHeaderClick={sortByColumn}
      selection={selection}
      selectionMode={
        checkboxVisibility === CheckboxVisibility.hidden
          ? SelectionMode.single
          : SelectionMode.multiple
      }
      checkboxVisibility={checkboxVisibility}
    />
  );
};

export default SortableDetailsList;
