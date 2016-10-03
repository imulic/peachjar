'use strict';

describe('Districts E2E Tests:', function () {
  describe('Test Districts page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/districts');
      expect(element.all(by.repeater('district in districts')).count()).toEqual(0);
    });
  });
});
