'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Flyer = mongoose.model('Flyer'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  flyer;

/**
 * Flyer routes tests
 */
describe('Flyer CRUD tests', function () {

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

    // Save a user to the test db and create new Flyer
    user.save(function () {
      flyer = {
        name: 'Flyer name'
      };

      done();
    });
  });

  it('should be able to save a Flyer if logged in', function (done) {
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

        // Save a new Flyer
        agent.post('/api/flyers')
          .send(flyer)
          .expect(200)
          .end(function (flyerSaveErr, flyerSaveRes) {
            // Handle Flyer save error
            if (flyerSaveErr) {
              return done(flyerSaveErr);
            }

            // Get a list of Flyers
            agent.get('/api/flyers')
              .end(function (flyersGetErr, flyersGetRes) {
                // Handle Flyers save error
                if (flyersGetErr) {
                  return done(flyersGetErr);
                }

                // Get Flyers list
                var flyers = flyersGetRes.body;

                // Set assertions
                (flyers[0].user._id).should.equal(userId);
                (flyers[0].name).should.match('Flyer name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Flyer if not logged in', function (done) {
    agent.post('/api/flyers')
      .send(flyer)
      .expect(403)
      .end(function (flyerSaveErr, flyerSaveRes) {
        // Call the assertion callback
        done(flyerSaveErr);
      });
  });

  it('should not be able to save an Flyer if no name is provided', function (done) {
    // Invalidate name field
    flyer.name = '';

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

        // Save a new Flyer
        agent.post('/api/flyers')
          .send(flyer)
          .expect(400)
          .end(function (flyerSaveErr, flyerSaveRes) {
            // Set message assertion
            (flyerSaveRes.body.message).should.match('Please fill Flyer name');

            // Handle Flyer save error
            done(flyerSaveErr);
          });
      });
  });

  it('should be able to update an Flyer if signed in', function (done) {
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

        // Save a new Flyer
        agent.post('/api/flyers')
          .send(flyer)
          .expect(200)
          .end(function (flyerSaveErr, flyerSaveRes) {
            // Handle Flyer save error
            if (flyerSaveErr) {
              return done(flyerSaveErr);
            }

            // Update Flyer name
            flyer.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Flyer
            agent.put('/api/flyers/' + flyerSaveRes.body._id)
              .send(flyer)
              .expect(200)
              .end(function (flyerUpdateErr, flyerUpdateRes) {
                // Handle Flyer update error
                if (flyerUpdateErr) {
                  return done(flyerUpdateErr);
                }

                // Set assertions
                (flyerUpdateRes.body._id).should.equal(flyerSaveRes.body._id);
                (flyerUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Flyers if not signed in', function (done) {
    // Create new Flyer model instance
    var flyerObj = new Flyer(flyer);

    // Save the flyer
    flyerObj.save(function () {
      // Request Flyers
      request(app).get('/api/flyers')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Flyer if not signed in', function (done) {
    // Create new Flyer model instance
    var flyerObj = new Flyer(flyer);

    // Save the Flyer
    flyerObj.save(function () {
      request(app).get('/api/flyers/' + flyerObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', flyer.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Flyer with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/flyers/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Flyer is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Flyer which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Flyer
    request(app).get('/api/flyers/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Flyer with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Flyer if signed in', function (done) {
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

        // Save a new Flyer
        agent.post('/api/flyers')
          .send(flyer)
          .expect(200)
          .end(function (flyerSaveErr, flyerSaveRes) {
            // Handle Flyer save error
            if (flyerSaveErr) {
              return done(flyerSaveErr);
            }

            // Delete an existing Flyer
            agent.delete('/api/flyers/' + flyerSaveRes.body._id)
              .send(flyer)
              .expect(200)
              .end(function (flyerDeleteErr, flyerDeleteRes) {
                // Handle flyer error error
                if (flyerDeleteErr) {
                  return done(flyerDeleteErr);
                }

                // Set assertions
                (flyerDeleteRes.body._id).should.equal(flyerSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Flyer if not signed in', function (done) {
    // Set Flyer user
    flyer.user = user;

    // Create new Flyer model instance
    var flyerObj = new Flyer(flyer);

    // Save the Flyer
    flyerObj.save(function () {
      // Try deleting Flyer
      request(app).delete('/api/flyers/' + flyerObj._id)
        .expect(403)
        .end(function (flyerDeleteErr, flyerDeleteRes) {
          // Set message assertion
          (flyerDeleteRes.body.message).should.match('User is not authorized');

          // Handle Flyer error error
          done(flyerDeleteErr);
        });

    });
  });

  it('should be able to get a single Flyer that has an orphaned user reference', function (done) {
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

          // Save a new Flyer
          agent.post('/api/flyers')
            .send(flyer)
            .expect(200)
            .end(function (flyerSaveErr, flyerSaveRes) {
              // Handle Flyer save error
              if (flyerSaveErr) {
                return done(flyerSaveErr);
              }

              // Set assertions on new Flyer
              (flyerSaveRes.body.name).should.equal(flyer.name);
              should.exist(flyerSaveRes.body.user);
              should.equal(flyerSaveRes.body.user._id, orphanId);

              // force the Flyer to have an orphaned user reference
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

                    // Get the Flyer
                    agent.get('/api/flyers/' + flyerSaveRes.body._id)
                      .expect(200)
                      .end(function (flyerInfoErr, flyerInfoRes) {
                        // Handle Flyer error
                        if (flyerInfoErr) {
                          return done(flyerInfoErr);
                        }

                        // Set assertions
                        (flyerInfoRes.body._id).should.equal(flyerSaveRes.body._id);
                        (flyerInfoRes.body.name).should.equal(flyer.name);
                        should.equal(flyerInfoRes.body.user, undefined);

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
      Flyer.remove().exec(done);
    });
  });
});
