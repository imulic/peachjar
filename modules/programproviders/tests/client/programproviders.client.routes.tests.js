(function () {
  'use strict';

  describe('Programproviders Route Tests', function () {
    // Initialize global variables
    var $scope,
      ProgramprovidersService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _ProgramprovidersService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      ProgramprovidersService = _ProgramprovidersService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('programproviders');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/programproviders');
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
          ProgramprovidersController,
          mockProgramprovider;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('programproviders.view');
          $templateCache.put('modules/programproviders/client/views/view-programprovider.client.view.html', '');

          // create mock Programprovider
          mockProgramprovider = new ProgramprovidersService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Programprovider Name'
          });

          // Initialize Controller
          ProgramprovidersController = $controller('ProgramprovidersController as vm', {
            $scope: $scope,
            programproviderResolve: mockProgramprovider
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:programproviderId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.programproviderResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            programproviderId: 1
          })).toEqual('/programproviders/1');
        }));

        it('should attach an Programprovider to the controller scope', function () {
          expect($scope.vm.programprovider._id).toBe(mockProgramprovider._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/programproviders/client/views/view-programprovider.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          ProgramprovidersController,
          mockProgramprovider;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('programproviders.create');
          $templateCache.put('modules/programproviders/client/views/form-programprovider.client.view.html', '');

          // create mock Programprovider
          mockProgramprovider = new ProgramprovidersService();

          // Initialize Controller
          ProgramprovidersController = $controller('ProgramprovidersController as vm', {
            $scope: $scope,
            programproviderResolve: mockProgramprovider
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.programproviderResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/programproviders/create');
        }));

        it('should attach an Programprovider to the controller scope', function () {
          expect($scope.vm.programprovider._id).toBe(mockProgramprovider._id);
          expect($scope.vm.programprovider._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/programproviders/client/views/form-programprovider.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          ProgramprovidersController,
          mockProgramprovider;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('programproviders.edit');
          $templateCache.put('modules/programproviders/client/views/form-programprovider.client.view.html', '');

          // create mock Programprovider
          mockProgramprovider = new ProgramprovidersService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Programprovider Name'
          });

          // Initialize Controller
          ProgramprovidersController = $controller('ProgramprovidersController as vm', {
            $scope: $scope,
            programproviderResolve: mockProgramprovider
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:programproviderId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.programproviderResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            programproviderId: 1
          })).toEqual('/programproviders/1/edit');
        }));

        it('should attach an Programprovider to the controller scope', function () {
          expect($scope.vm.programprovider._id).toBe(mockProgramprovider._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/programproviders/client/views/form-programprovider.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
