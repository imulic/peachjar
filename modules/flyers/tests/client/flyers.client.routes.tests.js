(function () {
  'use strict';

  describe('Flyers Route Tests', function () {
    // Initialize global variables
    var $scope,
      FlyersService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _FlyersService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      FlyersService = _FlyersService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('flyers');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/flyers');
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
          FlyersController,
          mockFlyer;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('flyers.view');
          $templateCache.put('modules/flyers/client/views/view-flyer.client.view.html', '');

          // create mock Flyer
          mockFlyer = new FlyersService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Flyer Name'
          });

          // Initialize Controller
          FlyersController = $controller('FlyersController as vm', {
            $scope: $scope,
            flyerResolve: mockFlyer
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:flyerId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.flyerResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            flyerId: 1
          })).toEqual('/flyers/1');
        }));

        it('should attach an Flyer to the controller scope', function () {
          expect($scope.vm.flyer._id).toBe(mockFlyer._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/flyers/client/views/view-flyer.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          FlyersController,
          mockFlyer;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('flyers.create');
          $templateCache.put('modules/flyers/client/views/form-flyer.client.view.html', '');

          // create mock Flyer
          mockFlyer = new FlyersService();

          // Initialize Controller
          FlyersController = $controller('FlyersController as vm', {
            $scope: $scope,
            flyerResolve: mockFlyer
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.flyerResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/flyers/create');
        }));

        it('should attach an Flyer to the controller scope', function () {
          expect($scope.vm.flyer._id).toBe(mockFlyer._id);
          expect($scope.vm.flyer._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/flyers/client/views/form-flyer.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          FlyersController,
          mockFlyer;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('flyers.edit');
          $templateCache.put('modules/flyers/client/views/form-flyer.client.view.html', '');

          // create mock Flyer
          mockFlyer = new FlyersService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Flyer Name'
          });

          // Initialize Controller
          FlyersController = $controller('FlyersController as vm', {
            $scope: $scope,
            flyerResolve: mockFlyer
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:flyerId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.flyerResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            flyerId: 1
          })).toEqual('/flyers/1/edit');
        }));

        it('should attach an Flyer to the controller scope', function () {
          expect($scope.vm.flyer._id).toBe(mockFlyer._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/flyers/client/views/form-flyer.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
