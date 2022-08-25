import styled from 'styled-components';
import { skeColor } from '@skatteetaten/frontend-components/utils';
import * as React from 'react';

const HighlightedValues = (props: { searchText: string; text: string }) => {
  const { searchText, text } = props;
  const lcText = text.toLowerCase();

  interface IIndices {
    start: number;
    end: number;
  }

  // Finner indekser for treff i søk:
  const indicesList: IIndices[] = searchText
    .split(' ')
    .map((value) => value.trim().toLowerCase())
    .filter((v) => v.length > 0)
    .flatMap((v) => {
      let startIndex = 0,
        index = 0,
        indices: IIndices[] = [];
      while ((index = lcText.indexOf(v, startIndex)) > -1) {
        indices.push({ start: index, end: index + v.length });
        startIndex = index + 1;
      }
      return indices;
    })
    .sort((a, b) => a!.start - b!.start);

  if (indicesList.length === 0) return null;

  // Fletter sammen overlappende treff:
  let mergedList: IIndices[] = [],
    current: IIndices = indicesList[0];
  for (let i = 0; i < indicesList.length; i++) {
    if (i === indicesList.length - 1) {
      mergedList.push(current);
    } else {
      const next = indicesList[i + 1];
      if (next.start < current.end) {
        if (next.end > current.end) current.end = next.end;
      } else {
        mergedList.push(current);
        current = next;
      }
    }
  }

  // Formaterer resultat:
  const startOfString =
    mergedList[0].start > 0 ? [<>{text.slice(0, mergedList[0].start)}</>] : [];
  return (
    <>
      {startOfString.concat(
        mergedList.flatMap((indices, i) => {
          const matchingString = (
            <Highlight key={`h${i}`}>
              {text.slice(indices.start, indices.end)}
            </Highlight>
          );
          const afterMatchingString = text.slice(
            indices.end,
            mergedList[i + 1]?.start
          );
          return afterMatchingString.length === 0
            ? [matchingString]
            : [matchingString, <>{afterMatchingString}</>];
        })
      )}
    </>
  );
};

const Highlight = styled.span`
  background-color: ${skeColor.lightBrown};
`;

export default HighlightedValues;
