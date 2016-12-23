var mongoose = require('mongoose');
var Block = mongoose.model('Block');

var sendJSONresponse = function(res, status, content) {
  res.status(status);
  res.json(content);
};

/* POST a new review, providing a blockid */
/* /api/locations/:blockid/reviews */
module.exports.reviewsCreate = function(req, res) {
  if (req.params.blockid) {
    Block
      .findById(req.params.blockid)
      .select('reviews')
      .exec(
        function(err, block) {
          if (err) {
            sendJSONresponse(res, 400, err);
          } else {
            doAddReview(req, res, block);
          }
        }
    );
  } else {
    sendJSONresponse(res, 404, {
      "message": "Not found, blockid required"
    });
  }
};


var doAddReview = function(req, res, block) {
  if (!block) {
    sendJSONresponse(res, 404, "blockid not found");
  } else {
    block.reviews.push({
      author: req.body.author,
      reviewText: req.body.reviewText
    });
    block.save(function(err, block) {
      var thisReview;
      if (err) {
        sendJSONresponse(res, 400, err);
      } else {
        sendJSONresponse(res, 201, thisReview);
      }
    });
  }
};

module.exports.reviewsUpdateOne = function(req, res) {
  if (!req.params.blockid || !req.params.reviewid) {
    sendJSONresponse(res, 404, { "message": "Not found, blockid and reviewid are both required"});
    return;
  }
  Block
    .findById(req.params.blockid)
    .select('reviews')
    .exec(
      function(err, block) {
        var thisReview;
        if (!block) {
          sendJSONresponse(res, 404, { "message": "blockid not found"});
          return;
        } else if (err) {
          sendJSONresponse(res, 400, err);
          return;
        }
        if (block.reviews && block.reviews.length > 0) {
          thisReview = block.reviews.id(req.params.reviewid);
          if (!thisReview) {
            sendJSONresponse(res, 404, { "message": "reviewid not found"});
          } else {
            thisReview.author = req.body.author;
            thisReview.reviewText = req.body.reviewText;
            block.save(function(err, block) {
              if (err) {
                sendJSONresponse(res, 404, err);
              } else {
                sendJSONresponse(res, 200, thisReview);
              }
            });
          }
        } else {
          sendJSONresponse(res, 404, { "message": "No review to update"});
        }
      }
  );
};

module.exports.reviewsReadOne = function(req, res) {
  if (req.params && req.params.blockid && req.params.reviewid) {
    Block
      .findById(req.params.blockid)
      .select('titulo reviews')
      .exec(
        function(err, block) {
          var response, review;
          if (!block) {
            sendJSONresponse(res, 404, { "message": "blockid not found"});
            return;
          } else if (err) {
            sendJSONresponse(res, 400, err);
            return;
          }
          if (block.reviews && block.reviews.length > 0) {
            review = block.reviews.id(req.params.reviewid);
            if (!review) {
              sendJSONresponse(res, 404, { "message": "reviewid not found"});
            } else {
              response = {
                block: {
                  titulo: block.titulo,
                  id: req.params.blockid
                },
                review: review
              };
              sendJSONresponse(res, 200, response);
            }
          } else {
            sendJSONresponse(res, 404, { "message": "No reviews found"});
          }
        }
    );
  } else {
    sendJSONresponse(res, 404, { "message": "Not found, blockid and reviewid are both required"});
  }
};

// app.delete('/api/locations/:blockid/reviews/:reviewid'
module.exports.reviewsDeleteOne = function(req, res) {
  if (!req.params.blockid || !req.params.reviewid) {
    sendJSONresponse(res, 404, { "message": "Not found, blockid and reviewid are both required" });
    return;
  }
  Block
    .findById(req.params.blockid)
    .select('reviews')
    .exec(
      function(err, block) {
        if (!block) {
          sendJSONresponse(res, 404, { "message": "blockid not found" });
          return;
        } else if (err) {
          sendJSONresponse(res, 400, err);
          return;
        }
        if (block.reviews && block.reviews.length > 0) {
          if (!block.reviews.id(req.params.reviewid)) {
            sendJSONresponse(res, 404, { "message": "reviewid not found"});
          } else {
            block.reviews.id(req.params.reviewid).remove();
            block.save(function(err) {
              if (err) {
                sendJSONresponse(res, 404, err);
              } else {
                updateAverageRating(block._id);
                sendJSONresponse(res, 204, null);
              }
            });
          }
        } else {
          sendJSONresponse(res, 404, { "message": "No review to delete"});
        }
      }
  );
};
