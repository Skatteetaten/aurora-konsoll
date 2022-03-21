import {dateSort, extractTimeAndSort, imageTagSort, searchTextSort, semanticVersionSort} from './sortFunctions';
import {IImageTag} from '../services/auroraApiClients/imageRepositoryClient/query';
import {ImageTagType} from '../models/ImageTagType';

describe('Sort functions', () => {

    describe('semanticVersionSort', () => {

        it('Returns expected value', () => {
            expect(semanticVersionSort('1', '2')).toBe(1);
            expect(semanticVersionSort('2', '1')).toBe(-1);
            expect(semanticVersionSort('2.2', '2.3')).toBe(1);
            expect(semanticVersionSort('2.3', '2.2')).toBe(-1);
            expect(semanticVersionSort('2.3.3', '2.3.4')).toBe(1);
            expect(semanticVersionSort('2.3.4', '2.3.3')).toBe(-1);
            expect(semanticVersionSort('2', '2.3')).toBe(-1);
            expect(semanticVersionSort('2.3', '2')).toBe(1);
        });

        it('Works correctly as argument in Array.sort()', () => {
           expect(['2.3', '2', '5.0.1', '5.0.2', '5.0.0', '1'].sort(semanticVersionSort))
               .toStrictEqual(['5.0.2', '5.0.1', '5.0.0', '2', '2.3', '1']);
        });
    });

    describe('extractTimeAndSort', () => {

        it('Returns expected value', () => {

            expect(extractTimeAndSort(
                'blablabla-20211021.140715-3-bla.bla.bla',
                'blablabla-20211021.091649-2-bla.bla.bla'
            )).toBeLessThan(0);

            expect(extractTimeAndSort(
                'blablabla-20211021.140715-3-bla.bla.bla',
                'blablabla-20211021.140715-2-bla.bla.bla'
            )).toBeLessThan(0);

            expect(extractTimeAndSort(
                'blablabla-20211021.140715-3-bla.bla.bla',
                'blablabla'
            )).toBeLessThan(0);

            expect(extractTimeAndSort(
                'blablabla-20211021.091649-2-bla.bla.bla',
                'blablabla-20211021.140715-3-bla.bla.bla'
            )).toBeGreaterThan(0);

            expect(extractTimeAndSort(
                'blablabla-20211021.140715-2-bla.bla.bla',
                'blablabla-20211021.140715-3-bla.bla.bla'
            )).toBeGreaterThan(0);

            expect(extractTimeAndSort(
                'blablabla',
                'blablabla-20211021.140715-3-bla.bla.bla'
            )).toBeGreaterThan(0);

            expect(extractTimeAndSort(
                'blablabla-20211021.140715-3-bla.bla.bla',
                'blablabla-20211021.140715-3-bla.bla.bla'
            )).toEqual(0);
        });

        it('Works correctly as argument in Array.sort()', () => {
            expect([
                'blablabla-20211021.140715-2-bla.bla.bla',
                'blablabla-20211021.140715-3-bla.bla.bla',
                'blablabla',
                'blablabla-20211021.091649-2-bla.bla.bla'
            ].sort(extractTimeAndSort)).toStrictEqual([
                'blablabla-20211021.140715-3-bla.bla.bla',
                'blablabla-20211021.140715-2-bla.bla.bla',
                'blablabla-20211021.091649-2-bla.bla.bla',
                'blablabla'
            ]);
        });
    });

    describe('sortByDate', () => {

        it('Returns expected value', () => {

            expect(dateSort(
                new Date(2022, 2, 22, 20, 22, 2),
                new Date(2011, 2, 11, 20, 11, 2)
            )).toBeLessThan(0);

            expect(dateSort(
                new Date(2011, 2, 11, 20, 11, 2),
                new Date(2022, 2, 22, 20, 22, 2)
            )).toBeGreaterThan(0);
        });

        it('Works correctly as argument in Array.sort()', () => {

            const date1 = new Date(2022, 2, 22, 20, 22, 2),
                  date2 = new Date(2022, 2, 11, 20, 22, 2),
                  date3 = new Date(2011, 2, 22, 20, 11, 2),
                  date4 = new Date(2011, 2, 11, 20, 11, 2);

            expect([date2, date4, date1, date3].sort(dateSort))
                .toStrictEqual([date1, date2, date3, date4]);
        });
    });

    describe('searchTextSort', () => {

        const list = ['to', 'Treff'],
              textWithTwoMatches = 'Her er det bare to treff',
              textWithEarlyMatch = 'to tidlige treff i tekst',
              textWithManyMatches = 'Mer enn to treff treff treff treff',
              textWithUpperCaseMatch = 'Her er det bare to Treff';

        it('Returns expected value', () => {
            expect(searchTextSort(list)(textWithTwoMatches, textWithManyMatches)).toBeGreaterThan(0);
            expect(searchTextSort(list)(textWithManyMatches, textWithTwoMatches)).toBeLessThan(0);
            expect(searchTextSort(list)(textWithTwoMatches, textWithUpperCaseMatch)).toBeGreaterThan(0);
            expect(searchTextSort(list)(textWithUpperCaseMatch, textWithTwoMatches)).toBeLessThan(0);
            expect(searchTextSort(list)(textWithTwoMatches, textWithEarlyMatch)).toBeGreaterThan(0);
            expect(searchTextSort(list)(textWithEarlyMatch, textWithTwoMatches)).toBeLessThan(0);
        });

        it('Works correctly as argument in Array.sort()', () => {
            expect(
                [
                    textWithTwoMatches,
                    textWithEarlyMatch,
                    textWithManyMatches,
                    textWithUpperCaseMatch
                ].sort(searchTextSort(list))
            ).toStrictEqual(
                [
                    textWithManyMatches,
                    textWithUpperCaseMatch,
                    textWithEarlyMatch,
                    textWithTwoMatches
                ]
            );
        })
    });

    // prettier-ignore
    describe('imageTagSort', () => {

        const majorWithDate1: IImageTag = { name: '6', type: ImageTagType.MAJOR, image: { buildTime: '2022-02-22T20:22:02.000000000Z' } },
              majorWithDate2: IImageTag = { name: '5', type: ImageTagType.MAJOR, image: { buildTime: '2022-02-11T20:22:02.000000000Z' } },
              majorWithDate3: IImageTag = { name: '4', type: ImageTagType.MAJOR, image: { buildTime: '2022-01-22T10:22:02.000000000Z' } },
              majorWithoutDate1: IImageTag = { name: '3', type: ImageTagType.MAJOR },
              majorWithoutDate2: IImageTag = { name: '2', type: ImageTagType.MAJOR },
              majorWithoutDate3: IImageTag = { name: '1', type: ImageTagType.MAJOR },

              minorWithDate1: IImageTag = { name: '1.6', type: ImageTagType.MINOR, image: { buildTime: '2022-02-22T20:22:02.000000000Z' } },
              minorWithDate2: IImageTag = { name: '1.5', type: ImageTagType.MINOR, image: { buildTime: '2022-02-11T20:22:02.000000000Z' } },
              minorWithDate3: IImageTag = { name: '1.4', type: ImageTagType.MINOR, image: { buildTime: '2022-01-22T10:22:02.000000000Z' } },
              minorWithoutDate1: IImageTag = {name: '1.3', type: ImageTagType.MINOR },
              minorWithoutDate2: IImageTag = {name: '1.2', type: ImageTagType.MINOR },
              minorWithoutDate3: IImageTag = {name: '1.1', type: ImageTagType.MINOR },

              bugfixWithDate1: IImageTag = { name: '1.1.6', type: ImageTagType.BUGFIX, image: { buildTime: '2022-02-22T20:22:02.000000000Z' } },
              bugfixWithDate2: IImageTag = { name: '1.1.5', type: ImageTagType.BUGFIX, image: { buildTime: '2022-02-11T20:22:02.000000000Z' } },
              bugfixWithDate3: IImageTag = { name: '1.1.4', type: ImageTagType.BUGFIX, image: { buildTime: '2022-01-22T10:22:02.000000000Z' } },
              bugfixWithoutDate1: IImageTag = {name: '1.1.3', type: ImageTagType.BUGFIX },
              bugfixWithoutDate2: IImageTag = {name: '1.1.2', type: ImageTagType.BUGFIX },
              bugfixWithoutDate3: IImageTag = {name: '1.1.1', type: ImageTagType.BUGFIX },

              auroraSnapshotVersionWithDate1: IImageTag = { name: 'bla-20220222.202202-6-bla', type: ImageTagType.AURORA_SNAPSHOT_VERSION, image: { buildTime: '2022-02-22T20:22:02.000000000Z' } },
              auroraSnapshotVersionWithDate2: IImageTag = { name: 'bla-20220211.202202-5-bla', type: ImageTagType.AURORA_SNAPSHOT_VERSION, image: { buildTime: '2022-02-11T20:22:02.000000000Z' } },
              auroraSnapshotVersionWithDate3: IImageTag = { name: 'bla-20220122.102202-4-bla', type: ImageTagType.AURORA_SNAPSHOT_VERSION, image: { buildTime: '2022-01-22T10:22:02.000000000Z' } },
              auroraSnapshotVersionWithoutDate1: IImageTag = {name: 'bla-20110222.201102-3-bla', type: ImageTagType.AURORA_SNAPSHOT_VERSION },
              auroraSnapshotVersionWithoutDate2: IImageTag = {name: 'bla-20110211.201102-2-bla', type: ImageTagType.AURORA_SNAPSHOT_VERSION },
              auroraSnapshotVersionWithoutDate3: IImageTag = {name: 'bla-20110122.201102-1-bla', type: ImageTagType.AURORA_SNAPSHOT_VERSION },

              auroraVersionWithDate1: IImageTag = { name: 'bla', type: ImageTagType.AURORA_VERSION, image: { buildTime: '2022-02-22T20:22:02.000000000Z' } },
              auroraVersionWithDate2: IImageTag = { name: 'blabla', type: ImageTagType.AURORA_VERSION, image: { buildTime: '2022-02-11T20:22:02.000000000Z' } },
              auroraVersionWithDate3: IImageTag = { name: 'blablabla', type: ImageTagType.AURORA_VERSION, image: { buildTime: '2022-01-22T10:22:02.000000000Z' } },
              auroraVersionWithoutDate1: IImageTag = {name: 'blablablabla', type: ImageTagType.AURORA_VERSION},
              auroraVersionWithoutDate2: IImageTag = {name: 'blablablablabla', type: ImageTagType.AURORA_VERSION },
              auroraVersionWithoutDate3: IImageTag = {name: 'blablablablablabla', type: ImageTagType.AURORA_VERSION };

        const testImageTagSort = (
            type: ImageTagType,
            versionWithDate1: IImageTag,
            versionWithDate2: IImageTag,
            versionWithDate3: IImageTag,
            versionWithoutDate1: IImageTag,
            versionWithoutDate2: IImageTag,
            versionWithoutDate3: IImageTag
        ) => () => {
            it('Returns expected value', () => {
                expect(imageTagSort(type)(versionWithDate1, versionWithDate2)).toBeLessThan(0);
                expect(imageTagSort(type)(versionWithDate2, versionWithDate1)).toBeGreaterThan(0);
                expect(imageTagSort(type)(versionWithoutDate1, versionWithoutDate2)).toBeLessThan(0);
                expect(imageTagSort(type)(versionWithoutDate2, versionWithoutDate1)).toBeGreaterThan(0);
                expect(imageTagSort(type)(versionWithDate1, versionWithoutDate1)).toBeLessThan(0);
                expect(imageTagSort(type)(versionWithoutDate1, versionWithDate1)).toBeGreaterThan(0);
            });
            it('Works correctly as argument in Array.sort()', () => {
                expect(
                    [
                        versionWithoutDate3,
                        versionWithoutDate1,
                        versionWithDate2,
                        versionWithDate1,
                        versionWithDate3,
                        versionWithoutDate2
                    ].sort(imageTagSort(type))
                ).toStrictEqual(
                    [
                        versionWithDate1,
                        versionWithDate2,
                        versionWithDate3,
                        versionWithoutDate1,
                        versionWithoutDate2,
                        versionWithoutDate3
                    ]
                );
            });
        }
        
        describe(
            'imageTagSort(ImageTagType.MAJOR)',
            testImageTagSort(
                ImageTagType.MAJOR,
                majorWithDate1,
                majorWithDate2,
                majorWithDate3,
                majorWithoutDate1,
                majorWithoutDate2,
                majorWithoutDate3
            )
        );

        describe(
            'imageTagSort(ImageTagType.MINOR)',
            testImageTagSort(
                ImageTagType.MAJOR,
                minorWithDate1,
                minorWithDate2,
                minorWithDate3,
                minorWithoutDate1,
                minorWithoutDate2,
                minorWithoutDate3
            )
        );

        describe(
            'imageTagSort(ImageTagType.BUGFIX)',
            testImageTagSort(
                ImageTagType.BUGFIX,
                bugfixWithDate1,
                bugfixWithDate2,
                bugfixWithDate3,
                bugfixWithoutDate1,
                bugfixWithoutDate2,
                bugfixWithoutDate3
            )
        );

        describe(
            'imageTagSort(ImageTagType.AURORA_SNAPSHOT_VERSION)',
            testImageTagSort(
                ImageTagType.AURORA_SNAPSHOT_VERSION,
                auroraSnapshotVersionWithDate1,
                auroraSnapshotVersionWithDate2,
                auroraSnapshotVersionWithDate3,
                auroraSnapshotVersionWithoutDate1,
                auroraSnapshotVersionWithoutDate2,
                auroraSnapshotVersionWithoutDate3
            )
        );

        describe('imageTagSort(ImageTagType.AURORA_VERSION)', () => {
            it('Returns expected value', () => {
                expect(imageTagSort(ImageTagType.AURORA_VERSION)(auroraVersionWithDate1, auroraVersionWithDate2)).toBeLessThan(0);
                expect(imageTagSort(ImageTagType.AURORA_VERSION)(auroraVersionWithDate2, auroraVersionWithDate1)).toBeGreaterThan(0);
                expect(imageTagSort(ImageTagType.AURORA_VERSION)(auroraVersionWithDate1, auroraVersionWithoutDate1)).toBeLessThan(0);
                expect(imageTagSort(ImageTagType.AURORA_VERSION)(auroraVersionWithoutDate1, auroraVersionWithDate1)).toBeGreaterThan(0);
            });
            it('Works correctly as argument in Array.sort()', () => {
                expect(
                    [
                        auroraVersionWithoutDate3,
                        auroraVersionWithoutDate1,
                        auroraVersionWithDate2,
                        auroraVersionWithDate1,
                        auroraVersionWithDate3,
                        auroraVersionWithoutDate2
                    ].sort(imageTagSort(ImageTagType.AURORA_VERSION))
                ).toStrictEqual(
                    [
                        auroraVersionWithDate1,
                        auroraVersionWithDate2,
                        auroraVersionWithDate3,
                        auroraVersionWithoutDate3,
                        auroraVersionWithoutDate1,
                        auroraVersionWithoutDate2
                    ]
                );
            });
        });

        describe('imageTagSort(ImageTagType.SEARCH, string[])', () => {
            it('Works correctly as argument in Array.sort()', () => {
                expect(
                    [
                        bugfixWithDate1,
                        majorWithDate1,
                        auroraSnapshotVersionWithDate1,
                        minorWithDate1
                    ].sort(imageTagSort(ImageTagType.SEARCH, ['6']))
                ).toStrictEqual(
                    [
                        majorWithDate1, // Exact match
                        minorWithDate1,
                        bugfixWithDate1,
                        auroraSnapshotVersionWithDate1
                    ]
                );
                expect(
                    [
                        bugfixWithoutDate3,
                        bugfixWithoutDate2,
                        bugfixWithoutDate1,
                        bugfixWithDate3,
                        bugfixWithDate2,
                        bugfixWithDate1,
                        minorWithoutDate3
                    ].sort(imageTagSort(ImageTagType.SEARCH, ['1.1']))
                ).toStrictEqual(
                    [
                        bugfixWithoutDate3, // 1.1.1
                        minorWithoutDate3, // 1.1
                        bugfixWithDate1, // 1.1.6
                        bugfixWithDate2, // 1.1.5
                        bugfixWithDate3, // 1.1.4
                        bugfixWithoutDate1, // 1.1.3
                        bugfixWithoutDate2 // 1.1.2
                    ]
                );
            });
        });
    });
});