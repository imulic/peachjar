'use strict';

describe('Flyers E2E Tests:', function () {
  describe('Test Flyers page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/flyers');
      expect(element.all(by.repeater('flyer in flyers')).count()).toEqual(0);
    });
  });
});
