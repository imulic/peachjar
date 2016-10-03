(function () {
  'use strict';

  describe('Districts Route Tests', function () {
    // Initialize global variables
    var $scope,
      DistrictsService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _DistrictsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      DistrictsService = _DistrictsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('districts');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/districts');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          DistrictsController,
          mockDistrict;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('districts.view');
          $templateCache.put('modules/districts/client/views/view-district.client.view.html', '');

          // create mock District
          mockDistrict = new DistrictsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'District Name'
          });

          // Initialize Controller
          DistrictsController = $controller('DistrictsController as vm', {
            $scope: $scope,
            districtResolve: mockDistrict
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:districtId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.districtResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            districtId: 1
          })).toEqual('/districts/1');
        }));

        it('should attach an District to the controller scope', function () {
          expect($scope.vm.district._id).toBe(mockDistrict._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/districts/client/views/view-district.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          DistrictsController,
          mockDistrict;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('districts.create');
          $templateCache.put('modules/districts/client/views/form-district.client.view.html', '');

          // create mock District
          mockDistrict = new DistrictsService();

          // Initialize Controller
          DistrictsController = $controller('DistrictsController as vm', {
            $scope: $scope,
            districtResolve: mockDistrict
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.districtResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/districts/create');
        }));

        it('should attach an District to the controller scope', function () {
          expect($scope.vm.district._id).toBe(mockDistrict._id);
          expect($scope.vm.district._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/districts/client/views/form-district.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          DistrictsController,
          mockDistrict;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('districts.edit');
          $templateCache.put('modules/districts/client/views/form-district.client.view.html', '');

          // create mock District
          mockDistrict = new DistrictsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'District Name'
          });

          // Initialize Controller
          DistrictsController = $controller('DistrictsController as vm', {
            $scope: $scope,
            districtResolve: mockDistrict
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:districtId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.districtResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            districtId: 1
          })).toEqual('/districts/1/edit');
        }));

        it('should attach an District to the controller scope', function () {
          expect($scope.vm.district._id).toBe(mockDistrict._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/districts/client/views/form-district.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
