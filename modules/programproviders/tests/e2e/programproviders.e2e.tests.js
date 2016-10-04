'use strict';

describe('Programproviders E2E Tests:', function () {
  describe('Test Programproviders page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/programproviders');
      expect(element.all(by.repeater('programprovider in programproviders')).count()).toEqual(0);
    });
  });
});
