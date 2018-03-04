var express = require("express");

var router = express.Router();

var TimeSheet = require("../models/time-sheet");

module.exports = function(app, passport) {
  router
    .route("/time-sheets")

    //create entity
    .post((req, res) => {
      // create a new instance of the mongoose model
      var entity = new TimeSheet();
      // set the name (comes from the request)
      entity.name = req.body.name;

      // save the entity and check for errors
      entity.save(function(err) {
        if (err) res.send(err);

        res.json({ message: "Entity created!" });
      });
    })

    //search entities
    .get((req, res) => {
      TimeSheet.find(function(err, entities) {
        if (err) res.send(err);

        res.json(entities);
      });
    });

  router
    .route("/time-sheets/:id")

    // get the entity with id
    .get(function(req, res) {
      TimeSheet.findById(req.params.id, function(err, entity) {
        if (err) res.send(err);
        res.json(entity);
      });
    })

    // update the entity with id
    .put(function(req, res) {
      // use our entity model to find the entity we want
      TimeSheet.findById(req.params.id, function(err, entity) {
        if (err) res.send(err);

        // update the entity info
        entity.name = req.body.name;

        // save the bear
        entity.save(function(err) {
          if (err) res.send(err);

          res.json({ message: "Entity updated!" });
        });
      });
    })

    // delete the entity with id
    .delete(function(req, res) {
      TimeSheet.remove(
        {
          _id: req.params.id
        },
        function(err, bear) {
          if (err) res.send(err);

          res.json({ message: "Successfully deleted" });
        }
      );
    });
  return router;
};
