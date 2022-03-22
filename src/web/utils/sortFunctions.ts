import { ImageTagType } from '../models/ImageTagType';
import { IImageTag } from '../services/auroraApiClients/imageRepositoryClient/query';

export const semanticVersionSort = (a: string, b: string) => {
  const aSplit = a.split('.');
  const bSplit = b.split('.');

  for (let i = 0; i < Math.min(aSplit.length, bSplit.length); i++) {
    const aVersion = +aSplit[i] || 0;
    const bVersion = +bSplit[i] || 0;

    if (aVersion !== bVersion) {
      return aVersion < bVersion ? 1 : -1;
    }
  }

  return aSplit.length - bSplit.length;
};

export const extractTimeAndSort = (a: string, b: string) => {
  const regex = /\d{8}\.\d{6}-\d+/;
  const aMatches = a.match(regex),
    bMatches = b.match(regex);

  const aHasExpectedFormat = aMatches?.length === 1,
    bHasExpectedFormat = bMatches?.length === 1;

  if (!aHasExpectedFormat && !bHasExpectedFormat) return 0;
  if (!aHasExpectedFormat) return 1;
  if (!bHasExpectedFormat) return -1;

  const aMatch = aMatches[0],
    bMatch = bMatches[0];

  const aTime = +(aMatch.substr(0, 8) + aMatch.substr(9, 6)),
    bTime = +(bMatch.substr(0, 8) + bMatch.substr(9, 6));

  if (aTime === bTime) return +bMatch.substr(16) - +aMatch.substr(16);
  else return bTime - aTime;
};

export const dateSort = (a: Date, b: Date) => b.getTime() - a.getTime();

export const searchTextSort =
  (searchValues: string[]) => (a: string, b: string) => {
    if (a.length === 0 && b.length === 0) return 0;
    if (a.length === 0) return 1;
    if (b.length === 0) return -1;

    const searchValuesLc = searchValues.map((t) => t.toLowerCase());
    const aLc = a.toLowerCase(),
      bLc = b.toLowerCase();

    const numberOfMatches = (value: string, text: string) => {
      let n = 0,
        i = 0;
      while (true) {
        i = text.indexOf(value, i);
        if (i >= 0) {
          n++;
          i++;
        } else break;
      }
      return n;
    };

    const calculateMatchingChars = (values: string[], text: string) => {
      // Finner antallet tegn i teksten som inngår i treff i søket:
      const numberOfMatchingChars = values.reduce(
        (acc, c) => c.length * numberOfMatches(c, text) + acc,
        0
      );
      // Regner ut hvor stor andel av teksten som inngår i treff i søket:
      return numberOfMatchingChars / text.length;
    };

    // Sorterer tekst etter andelen som inngår i søketreff
    const aRelativeMatch = calculateMatchingChars(searchValuesLc, aLc),
      bRelativeMatch = calculateMatchingChars(searchValuesLc, bLc);
    if (aRelativeMatch !== bRelativeMatch) {
      return aRelativeMatch > bRelativeMatch ? -1 : 1;
    }

    // Andelene er like. Prøver igjen med skille mellom store og små bokstaver.
    const aRelativeMatchCs = calculateMatchingChars(searchValues, a),
      bRelativeMatchCs = calculateMatchingChars(searchValues, b);
    if (aRelativeMatchCs !== bRelativeMatchCs) {
      return aRelativeMatchCs > bRelativeMatchCs ? -1 : 1;
    }

    // Fortsatt likt. Sorterer etter hvor tidlig første treff kommer i teksten.
    const aFirst = Math.min(...searchValuesLc.map((t) => aLc.indexOf(t))),
      bFirst = Math.min(...searchValuesLc.map((t) => bLc.indexOf(t)));
    return aFirst - bFirst;
  };

export const imageTagSort =
  (type: ImageTagType, searchTexts?: string[]) =>
  (a: IImageTag, b: IImageTag) => {
    if (type === ImageTagType.SEARCH && searchTexts) {
      const searchTextSortResult = searchTextSort(searchTexts)(a.name, b.name);
      if (searchTextSortResult !== 0) return searchTextSortResult;
    }

    if (a.image?.buildTime && b.image?.buildTime)
      return dateSort(new Date(a.image.buildTime), new Date(b.image.buildTime));
    if (a.image?.buildTime) return -1;
    if (b.image?.buildTime) return 1;

    switch (type === ImageTagType.SEARCH && a.type === b.type ? a.type : type) {
      case ImageTagType.MAJOR:
      case ImageTagType.MINOR:
      case ImageTagType.BUGFIX:
        return semanticVersionSort(a.name, b.name);

      case ImageTagType.AURORA_SNAPSHOT_VERSION:
        return extractTimeAndSort(a.name, b.name);

      default:
        return 0;
    }
  };
