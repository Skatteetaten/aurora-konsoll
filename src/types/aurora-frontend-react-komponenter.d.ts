declare module '@skatteetaten/frontend-components/*';
declare module '@skatteetaten/frontend-components/Dropdown' {
  let Dropdown: any;
  export interface IDropdownOption {
    key: string;
    text: string;
  }

  export default Dropdown;
}
