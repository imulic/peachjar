'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  District = mongoose.model('District'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  district;

/**
 * District routes tests
 */
describe('District CRUD tests', function () {

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

    // Save a user to the test db and create new District
    user.save(function () {
      district = {
        name: 'District name'
      };

      done();
    });
  });

  it('should be able to save a District if logged in', function (done) {
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

        // Save a new District
        agent.post('/api/districts')
          .send(district)
          .expect(200)
          .end(function (districtSaveErr, districtSaveRes) {
            // Handle District save error
            if (districtSaveErr) {
              return done(districtSaveErr);
            }

            // Get a list of Districts
            agent.get('/api/districts')
              .end(function (districtsGetErr, districtsGetRes) {
                // Handle Districts save error
                if (districtsGetErr) {
                  return done(districtsGetErr);
                }

                // Get Districts list
                var districts = districtsGetRes.body;

                // Set assertions
                (districts[0].user._id).should.equal(userId);
                (districts[0].name).should.match('District name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an District if not logged in', function (done) {
    agent.post('/api/districts')
      .send(district)
      .expect(403)
      .end(function (districtSaveErr, districtSaveRes) {
        // Call the assertion callback
        done(districtSaveErr);
      });
  });

  it('should not be able to save an District if no name is provided', function (done) {
    // Invalidate name field
    district.name = '';

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

        // Save a new District
        agent.post('/api/districts')
          .send(district)
          .expect(400)
          .end(function (districtSaveErr, districtSaveRes) {
            // Set message assertion
            (districtSaveRes.body.message).should.match('Please fill District name');

            // Handle District save error
            done(districtSaveErr);
          });
      });
  });

  it('should be able to update an District if signed in', function (done) {
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

        // Save a new District
        agent.post('/api/districts')
          .send(district)
          .expect(200)
          .end(function (districtSaveErr, districtSaveRes) {
            // Handle District save error
            if (districtSaveErr) {
              return done(districtSaveErr);
            }

            // Update District name
            district.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing District
            agent.put('/api/districts/' + districtSaveRes.body._id)
              .send(district)
              .expect(200)
              .end(function (districtUpdateErr, districtUpdateRes) {
                // Handle District update error
                if (districtUpdateErr) {
                  return done(districtUpdateErr);
                }

                // Set assertions
                (districtUpdateRes.body._id).should.equal(districtSaveRes.body._id);
                (districtUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Districts if not signed in', function (done) {
    // Create new District model instance
    var districtObj = new District(district);

    // Save the district
    districtObj.save(function () {
      // Request Districts
      request(app).get('/api/districts')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single District if not signed in', function (done) {
    // Create new District model instance
    var districtObj = new District(district);

    // Save the District
    districtObj.save(function () {
      request(app).get('/api/districts/' + districtObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', district.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single District with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/districts/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'District is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single District which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent District
    request(app).get('/api/districts/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No District with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an District if signed in', function (done) {
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

        // Save a new District
        agent.post('/api/districts')
          .send(district)
          .expect(200)
          .end(function (districtSaveErr, districtSaveRes) {
            // Handle District save error
            if (districtSaveErr) {
              return done(districtSaveErr);
            }

            // Delete an existing District
            agent.delete('/api/districts/' + districtSaveRes.body._id)
              .send(district)
              .expect(200)
              .end(function (districtDeleteErr, districtDeleteRes) {
                // Handle district error error
                if (districtDeleteErr) {
                  return done(districtDeleteErr);
                }

                // Set assertions
                (districtDeleteRes.body._id).should.equal(districtSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an District if not signed in', function (done) {
    // Set District user
    district.user = user;

    // Create new District model instance
    var districtObj = new District(district);

    // Save the District
    districtObj.save(function () {
      // Try deleting District
      request(app).delete('/api/districts/' + districtObj._id)
        .expect(403)
        .end(function (districtDeleteErr, districtDeleteRes) {
          // Set message assertion
          (districtDeleteRes.body.message).should.match('User is not authorized');

          // Handle District error error
          done(districtDeleteErr);
        });

    });
  });

  it('should be able to get a single District that has an orphaned user reference', function (done) {
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

          // Save a new District
          agent.post('/api/districts')
            .send(district)
            .expect(200)
            .end(function (districtSaveErr, districtSaveRes) {
              // Handle District save error
              if (districtSaveErr) {
                return done(districtSaveErr);
              }

              // Set assertions on new District
              (districtSaveRes.body.name).should.equal(district.name);
              should.exist(districtSaveRes.body.user);
              should.equal(districtSaveRes.body.user._id, orphanId);

              // force the District to have an orphaned user reference
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

                    // Get the District
                    agent.get('/api/districts/' + districtSaveRes.body._id)
                      .expect(200)
                      .end(function (districtInfoErr, districtInfoRes) {
                        // Handle District error
                        if (districtInfoErr) {
                          return done(districtInfoErr);
                        }

                        // Set assertions
                        (districtInfoRes.body._id).should.equal(districtSaveRes.body._id);
                        (districtInfoRes.body.name).should.equal(district.name);
                        should.equal(districtInfoRes.body.user, undefined);

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
      District.remove().exec(done);
    });
  });
});
