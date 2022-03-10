import React, { useEffect, KeyboardEvent, useRef, useState } from 'react';
import { Button } from '@skatteetaten/frontend-components/Button';
import { TextField } from '@skatteetaten/frontend-components/TextField';
import { SkeBasis } from '@skatteetaten/frontend-components/SkeBasis';

import { ITextField } from '@fluentui/react';

const { skeColor } = SkeBasis.PALETTE;

interface ISearchProps {
  setTypeToSearch: () => void;
  handleSetSearchText: (text: string) => void;
}

export const Search = ({
  setTypeToSearch,
  handleSetSearchText
}: ISearchProps) => {
  const textFieldRef = useRef<ITextField | null>();
  const [isSearchButtonDisabled, setSearchButtonDisabled] = useState(true);

  useEffect(() => {
    if (textFieldRef.current) {
      textFieldRef.current.focus();
    }
  }, [textFieldRef]);

  const searchOnEnterPress = (
    e: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (e.key === 'Enter') {
      searchOnClick();
    }
  };

  const searchOnClick = () => {
    setTypeToSearch();
    const text = textFieldRef.current?.value;
    if (text) handleSetSearchText(text);
  };

  return (
    <>
      <div style={{ width: 300, marginLeft: 20, marginRight: 20 }}>
        <TextField
          componentRef={(ref) => (textFieldRef.current = ref)}
          placeholder="Søk etter versjon"
          onKeyUp={() =>
            !textFieldRef.current?.value
              ? setSearchButtonDisabled(true)
              : setSearchButtonDisabled(false)
          }
          onKeyPress={searchOnEnterPress}
          iconProps={{ iconName: 'Search', style: { color: skeColor.blue } }}
        />
      </div>
      <Button
        buttonStyle="primary"
        onClick={searchOnClick}
        disabled={isSearchButtonDisabled}
      >
        Søk
      </Button>
    </>
  );
};
