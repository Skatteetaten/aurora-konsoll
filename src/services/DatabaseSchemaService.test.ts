import {
  createDatabaseSchemaInputFactory,
  databaseSchemaFactory,
  databaseSchemaInputFactory,
  databaseSchemaInputWithCreatedByFactory,
  jdbcUserFactory
} from 'testData/testDataBuilders';
import DatabaseSchemaService from './DatabaseSchemaService';

describe('DatabaseSchemaService', () => {
  const databaseSchemaService = new DatabaseSchemaService();

  describe('trimLabelsAndJdbcUser', () => {
    it('should trim labels values', () => {
      const databseSchema = createDatabaseSchemaInputFactory.build({
        environment: 'environment ',
        discriminator: ' db ',
        createdBy: ' 123',
        jdbcUser: null
      });

      expect(
        databaseSchemaService.trimLabelsAndJdbcUser(databseSchema)
      ).toEqual({
        affiliation: 'paas',
        application: 'app',
        description: null,
        createdBy: '123',
        engine: 'ORACLE',
        discriminator: 'db',
        environment: 'environment',
        jdbcUser: null
      });
    });

    it('should trim labels and jdbcUser values', () => {
      const databseSchema = createDatabaseSchemaInputFactory.build({
        application: ' app ',
        discriminator: ' db ',
        createdBy: ' ',
        engine: 'ORACLE',
        jdbcUser: {
          jdbcUrl: ' test.no',
          password: '123 '
        }
      });

      expect(
        databaseSchemaService.trimLabelsAndJdbcUser(databseSchema)
      ).toEqual({
        affiliation: 'paas',
        application: 'app',
        createdBy: '',
        description: null,
        engine: 'ORACLE',
        discriminator: 'db',
        environment: 'env',
        jdbcUser: { jdbcUrl: 'test.no', password: '123', username: 'username' }
      });
    });

    it('should given no spaces in front or behind any values, do nothing to the schema', () => {
      const databseSchema = createDatabaseSchemaInputFactory.build();
      expect(
        databaseSchemaService.trimLabelsAndJdbcUser(databseSchema)
      ).toEqual(databseSchema);
    });
  });

  describe('Is update button disabled', () => {
    const databaseSchema = databaseSchemaFactory.build();

    it('Button is disabled given unchanged and non-empty values', () => {
      const updatedDatabaseSchema = databaseSchemaInputWithCreatedByFactory.build();

      const isDisabled = databaseSchemaService.isUpdateButtonDisabled(
        updatedDatabaseSchema,
        databaseSchema
      );
      expect(isDisabled).toBeTruthy();
    });

    it('Button is enabled given changed value', () => {
      const updatedDatabaseSchema = databaseSchemaInputWithCreatedByFactory.build(
        { application: 'referanse' }
      );

      const isDisabled = databaseSchemaService.isUpdateButtonDisabled(
        updatedDatabaseSchema,
        databaseSchema
      );
      expect(isDisabled).toBeFalsy();
    });

    it('Button is disabled given empty value', () => {
      const updatedDatabaseSchema = databaseSchemaInputWithCreatedByFactory.build(
        { environment: '' }
      );

      const isDisabled = databaseSchemaService.isUpdateButtonDisabled(
        updatedDatabaseSchema,
        databaseSchema
      );
      expect(isDisabled).toBeTruthy();
    });

    it('Button is disabled given null description and empty input', () => {
      const databaseSchemaWithNullDescription = databaseSchemaFactory.build({
        description: null
      });
      const updatedDatabaseSchema = databaseSchemaInputWithCreatedByFactory.build(
        { description: '' }
      );

      const isDisabled = databaseSchemaService.isUpdateButtonDisabled(
        updatedDatabaseSchema,
        databaseSchemaWithNullDescription
      );
      expect(isDisabled).toBeTruthy();
    });

    it('hasEmptyLabelValues given affiliation with only spaces', () => {
      const databaseSchemaInput = databaseSchemaInputFactory.build({
        environment: '      '
      });

      const hasEmptyValues = databaseSchemaService.hasEmptyLabelValues(
        databaseSchemaInput
      );
      expect(hasEmptyValues).toBeTruthy();
    });

    it('hasEmptyJdbcValues given undefined jdbcUser', () => {
      const isUndefined = databaseSchemaService.hasEmptyJdbcValues(undefined);
      expect(isUndefined).toBeTruthy();
    });

    it('hasEmptyJdbcValues given jdbcUrl with spaces', () => {
      const jdbcUserInput = jdbcUserFactory.build({
        jdbcUrl: '       '
      });

      const isEmpty = databaseSchemaService.hasEmptyJdbcValues(jdbcUserInput);
      expect(isEmpty).toBeTruthy();
    });

    it('hasEmptyJdbcValues given valid jdbcUser', () => {
      const jdbcUserInput = jdbcUserFactory.build();

      const isValid = databaseSchemaService.hasEmptyJdbcValues(jdbcUserInput);
      expect(isValid).toBeFalsy();
    });

    it('getSelectionDetails given 3 schemas', () => {
      const selectionDetails = databaseSchemaService.getSelectionDetails([
        '123',
        '234',
        '345'
      ]);
      expect(selectionDetails).toEqual('Vil du slette disse 3 skjemaene?');
    });

    it('getSelectionDetails given one schema', () => {
      const selectionDetails = databaseSchemaService.getSelectionDetails([
        '123'
      ]);
      expect(selectionDetails).toEqual('Vil du slette dette skjemaet?');
    });
  });
});
