const routes = require('express').Router();
const request = require("request");
const cheerio = require("cheerio");

const Note = require("../models/Note.js");
const Article = require("../models/Article.js");

// Routes
// ======

// A GET request to scrape the echojs website
routes.get("/", function (req, res) {
  // First, we grab the body of the html with request
  request("http://www.africanews.com/", function (error, response, html) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(html);
    // Now, we grab every h2 within an article tag, and do the following:
    $("h3.just-in__title").each(function (i, element) {

      // Save an empty result object
      var result = {};

      // Add the text and href of every link, and save them as properties of the result object
      result.title = $(this).children("a").attr("title");
      result.link = $(this).children("a").attr("href");

      // Using our Article model, create a new entry
      // This effectively passes the result object to the entry (and the title and link)
      var entry = new Article(result);

      // Now, save that entry to the db
      entry.save(function (err, doc) {
        // Log any errors
        if (err) {
          console.log(err);
        }
        // Or log the doc
        else {
          console.log(doc);
        }
      });
      // res.render("index", { results: result });
    });
  });
  // Tell the browser that we finished scraping the text
  
});

// This will get the articles we scraped from the mongoDB
routes.get("/articles", function (req, res) {
  Article.find({}, function (error, doc) {
    // Send any errors to the browser
    if (error) {
      res.send(error);
    }
    // Or send the doc to the browser
    else {
      res.json(doc);
    }
  });
});

// This will grab an article by it's ObjectId
routes.get("/articles/:id", function (req, res) {


  // TODO
  // ====

  // Finish the route so it finds one article using the req.params.id,

  // and run the populate method with "note",

  // then responds with the article with the note included
  Article.findOne({ _id: req.params.id })
    .populate('note')
    .exec(function (error, doc) {
      // Send any errors to the browser
      if (error) {
        res.send(error);
      }
      // Or send the doc to the browser
      else {
        res.send(doc);
      }
    })
});

// Create a new note or replace an existing note
routes.post("/articles/:id", function (req, res) {


  // TODO
  // ====

  // save the new note that gets posted to the Notes collection

  // then find an article from the req.params.id

  // and update it's "note" property with the _id of the new note
  // Use our Note model to make a new note from the req.body

  var newNote = new Note(req.body);
  // Save the new note to mongoose
  newNote.save(function (error, doc) {
    // Send any errors to the browser
    if (error) {
      res.send(error);
    }
    // Otherwise
    else {
      // Find our user and push the new note id into the User's notes array
      Article.findOneAndUpdate(
        { _id: req.params.id },
        { note: doc._id },
        { new: true },
        function (err, newdoc) {
          // Send any errors to the browser
          if (err) {
            res.send(err);
          }
          // Or send the newdoc to the browser
          else {
            res.send(newdoc);
          }
        });
    }
  });

});



module.exports = routes;