'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Programprovider = mongoose.model('Programprovider'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  programprovider;

/**
 * Programprovider routes tests
 */
describe('Programprovider CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Programprovider
    user.save(function () {
      programprovider = {
        name: 'Programprovider name'
      };

      done();
    });
  });

  it('should be able to save a Programprovider if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Programprovider
        agent.post('/api/programproviders')
          .send(programprovider)
          .expect(200)
          .end(function (programproviderSaveErr, programproviderSaveRes) {
            // Handle Programprovider save error
            if (programproviderSaveErr) {
              return done(programproviderSaveErr);
            }

            // Get a list of Programproviders
            agent.get('/api/programproviders')
              .end(function (programprovidersGetErr, programprovidersGetRes) {
                // Handle Programproviders save error
                if (programprovidersGetErr) {
                  return done(programprovidersGetErr);
                }

                // Get Programproviders list
                var programproviders = programprovidersGetRes.body;

                // Set assertions
                (programproviders[0].user._id).should.equal(userId);
                (programproviders[0].name).should.match('Programprovider name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Programprovider if not logged in', function (done) {
    agent.post('/api/programproviders')
      .send(programprovider)
      .expect(403)
      .end(function (programproviderSaveErr, programproviderSaveRes) {
        // Call the assertion callback
        done(programproviderSaveErr);
      });
  });

  it('should not be able to save an Programprovider if no name is provided', function (done) {
    // Invalidate name field
    programprovider.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Programprovider
        agent.post('/api/programproviders')
          .send(programprovider)
          .expect(400)
          .end(function (programproviderSaveErr, programproviderSaveRes) {
            // Set message assertion
            (programproviderSaveRes.body.message).should.match('Please fill Programprovider name');

            // Handle Programprovider save error
            done(programproviderSaveErr);
          });
      });
  });

  it('should be able to update an Programprovider if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Programprovider
        agent.post('/api/programproviders')
          .send(programprovider)
          .expect(200)
          .end(function (programproviderSaveErr, programproviderSaveRes) {
            // Handle Programprovider save error
            if (programproviderSaveErr) {
              return done(programproviderSaveErr);
            }

            // Update Programprovider name
            programprovider.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Programprovider
            agent.put('/api/programproviders/' + programproviderSaveRes.body._id)
              .send(programprovider)
              .expect(200)
              .end(function (programproviderUpdateErr, programproviderUpdateRes) {
                // Handle Programprovider update error
                if (programproviderUpdateErr) {
                  return done(programproviderUpdateErr);
                }

                // Set assertions
                (programproviderUpdateRes.body._id).should.equal(programproviderSaveRes.body._id);
                (programproviderUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Programproviders if not signed in', function (done) {
    // Create new Programprovider model instance
    var programproviderObj = new Programprovider(programprovider);

    // Save the programprovider
    programproviderObj.save(function () {
      // Request Programproviders
      request(app).get('/api/programproviders')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Programprovider if not signed in', function (done) {
    // Create new Programprovider model instance
    var programproviderObj = new Programprovider(programprovider);

    // Save the Programprovider
    programproviderObj.save(function () {
      request(app).get('/api/programproviders/' + programproviderObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', programprovider.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Programprovider with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/programproviders/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Programprovider is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Programprovider which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Programprovider
    request(app).get('/api/programproviders/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Programprovider with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Programprovider if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Programprovider
        agent.post('/api/programproviders')
          .send(programprovider)
          .expect(200)
          .end(function (programproviderSaveErr, programproviderSaveRes) {
            // Handle Programprovider save error
            if (programproviderSaveErr) {
              return done(programproviderSaveErr);
            }

            // Delete an existing Programprovider
            agent.delete('/api/programproviders/' + programproviderSaveRes.body._id)
              .send(programprovider)
              .expect(200)
              .end(function (programproviderDeleteErr, programproviderDeleteRes) {
                // Handle programprovider error error
                if (programproviderDeleteErr) {
                  return done(programproviderDeleteErr);
                }

                // Set assertions
                (programproviderDeleteRes.body._id).should.equal(programproviderSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Programprovider if not signed in', function (done) {
    // Set Programprovider user
    programprovider.user = user;

    // Create new Programprovider model instance
    var programproviderObj = new Programprovider(programprovider);

    // Save the Programprovider
    programproviderObj.save(function () {
      // Try deleting Programprovider
      request(app).delete('/api/programproviders/' + programproviderObj._id)
        .expect(403)
        .end(function (programproviderDeleteErr, programproviderDeleteRes) {
          // Set message assertion
          (programproviderDeleteRes.body.message).should.match('User is not authorized');

          // Handle Programprovider error error
          done(programproviderDeleteErr);
        });

    });
  });

  it('should be able to get a single Programprovider that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Programprovider
          agent.post('/api/programproviders')
            .send(programprovider)
            .expect(200)
            .end(function (programproviderSaveErr, programproviderSaveRes) {
              // Handle Programprovider save error
              if (programproviderSaveErr) {
                return done(programproviderSaveErr);
              }

              // Set assertions on new Programprovider
              (programproviderSaveRes.body.name).should.equal(programprovider.name);
              should.exist(programproviderSaveRes.body.user);
              should.equal(programproviderSaveRes.body.user._id, orphanId);

              // force the Programprovider to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Programprovider
                    agent.get('/api/programproviders/' + programproviderSaveRes.body._id)
                      .expect(200)
                      .end(function (programproviderInfoErr, programproviderInfoRes) {
                        // Handle Programprovider error
                        if (programproviderInfoErr) {
                          return done(programproviderInfoErr);
                        }

                        // Set assertions
                        (programproviderInfoRes.body._id).should.equal(programproviderSaveRes.body._id);
                        (programproviderInfoRes.body.name).should.equal(programprovider.name);
                        should.equal(programproviderInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Programprovider.remove().exec(done);
    });
  });
});
