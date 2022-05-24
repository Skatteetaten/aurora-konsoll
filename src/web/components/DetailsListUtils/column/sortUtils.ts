import { createDate } from 'web/utils/date';

export const sort = ({ isDescending, fieldName, items }) => {
  if (isDescending) {
    return items.sort((a, b) => a[fieldName].localeCompare(b[fieldName]));
  } else {
    return items.sort((a, b) => b[fieldName].localeCompare(a[fieldName]));
  }
};

export const sortDate = ({ isDescending, fieldName, items }) => {
  if (isDescending) {
    return items.sort(
      (a, b) =>
        createDate(b[fieldName]).getTime() - createDate(a[fieldName]).getTime()
    );
  } else {
    return items.sort(
      (a, b) =>
        createDate(a[fieldName]).getTime() - createDate(b[fieldName]).getTime()
    );
  }
};

export const sortIcon = ({ isDescending, fieldName, items }) => {
  if (isDescending) {
    return items.sort((a, b) =>
      a[fieldName].props.iconName.localeCompare(b[fieldName].props.iconName)
    );
  } else {
    return items.sort((a, b) =>
      b[fieldName].props.iconName.localeCompare(a[fieldName].props.iconName)
    );
  }
};
