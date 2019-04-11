import each from 'jest-each';
import {
  certificateInitialFactory,
  certificateResultFactory
} from 'testData/testDataBuilders';
import { fetchCertificatesRequest, fetchCertificatesResponse } from './actions';
import { certificateReducer } from './reducers';

describe('certificate reducer', () => {
  each([
    [
      {
        name: 'fetchCertificatesRequest',
        item: certificateInitialFactory.build()
      },
      {
        name: 'isFetchingCertificates',
        item: fetchCertificatesRequest(true)
      },
      certificateInitialFactory.build({
        isFetchingCertificates: true
      })
    ],
    [
      {
        name: 'fetchCertificatesResponse',
        item: certificateInitialFactory.build()
      },
      {
        name: 'certificates',
        item: fetchCertificatesResponse(certificateResultFactory.build())
      },
      certificateInitialFactory.build({
        certificates: certificateResultFactory.build()
      })
    ]
  ]).describe.only('', (a, b, expected) => {
    test.only(`given defaultState and action ${
      a.name
    } with given value should change ${b.name} to given value`, () => {
      expect(certificateReducer(a.item, b.item)).toEqual(expected);
    });
  });
});
