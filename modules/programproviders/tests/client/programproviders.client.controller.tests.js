(function () {
  'use strict';

  describe('Programproviders Controller Tests', function () {
    // Initialize global variables
    var ProgramprovidersController,
      $scope,
      $httpBackend,
      $state,
      Authentication,
      ProgramprovidersService,
      mockProgramprovider;

    // The $resource service augments the response object with methods for updating and deleting the resource.
    // If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
    // the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
    // When the toEqualData matcher compares two objects, it takes only object properties into
    // account and ignores methods.
    beforeEach(function () {
      jasmine.addMatchers({
        toEqualData: function (util, customEqualityTesters) {
          return {
            compare: function (actual, expected) {
              return {
                pass: angular.equals(actual, expected)
              };
            }
          };
        }
      });
    });

    // Then we can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($controller, $rootScope, _$state_, _$httpBackend_, _Authentication_, _ProgramprovidersService_) {
      // Set a new global scope
      $scope = $rootScope.$new();

      // Point global variables to injected services
      $httpBackend = _$httpBackend_;
      $state = _$state_;
      Authentication = _Authentication_;
      ProgramprovidersService = _ProgramprovidersService_;

      // create mock Programprovider
      mockProgramprovider = new ProgramprovidersService({
        _id: '525a8422f6d0f87f0e407a33',
        name: 'Programprovider Name'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Programproviders controller.
      ProgramprovidersController = $controller('ProgramprovidersController as vm', {
        $scope: $scope,
        programproviderResolve: {}
      });

      // Spy on state go
      spyOn($state, 'go');
    }));

    describe('vm.save() as create', function () {
      var sampleProgramproviderPostData;

      beforeEach(function () {
        // Create a sample Programprovider object
        sampleProgramproviderPostData = new ProgramprovidersService({
          name: 'Programprovider Name'
        });

        $scope.vm.programprovider = sampleProgramproviderPostData;
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (ProgramprovidersService) {
        // Set POST response
        $httpBackend.expectPOST('api/programproviders', sampleProgramproviderPostData).respond(mockProgramprovider);

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test URL redirection after the Programprovider was created
        expect($state.go).toHaveBeenCalledWith('programproviders.view', {
          programproviderId: mockProgramprovider._id
        });
      }));

      it('should set $scope.vm.error if error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/programproviders', sampleProgramproviderPostData).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect($scope.vm.error).toBe(errorMessage);
      });
    });

    describe('vm.save() as update', function () {
      beforeEach(function () {
        // Mock Programprovider in $scope
        $scope.vm.programprovider = mockProgramprovider;
      });

      it('should update a valid Programprovider', inject(function (ProgramprovidersService) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/programproviders\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test URL location to new object
        expect($state.go).toHaveBeenCalledWith('programproviders.view', {
          programproviderId: mockProgramprovider._id
        });
      }));

      it('should set $scope.vm.error if error', inject(function (ProgramprovidersService) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/programproviders\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect($scope.vm.error).toBe(errorMessage);
      }));
    });

    describe('vm.remove()', function () {
      beforeEach(function () {
        // Setup Programproviders
        $scope.vm.programprovider = mockProgramprovider;
      });

      it('should delete the Programprovider and redirect to Programproviders', function () {
        // Return true on confirm message
        spyOn(window, 'confirm').and.returnValue(true);

        $httpBackend.expectDELETE(/api\/programproviders\/([0-9a-fA-F]{24})$/).respond(204);

        $scope.vm.remove();
        $httpBackend.flush();

        expect($state.go).toHaveBeenCalledWith('programproviders.list');
      });

      it('should should not delete the Programprovider and not redirect', function () {
        // Return false on confirm message
        spyOn(window, 'confirm').and.returnValue(false);

        $scope.vm.remove();

        expect($state.go).not.toHaveBeenCalled();
      });
    });
  });
}());
