var mongoose = require('mongoose');
var Block = mongoose.model('Block');

var sendJSONresponse = function(res, status, content) {
  res.status(status);
  res.json(content);
};

/* GET list of block */
module.exports.blockListById = function(req, res) {
  Block
    .find()
    .exec(function(err, block) {
        if (!block) {
          sendJSONresponse(res, 404, { "message": "not found"});
          return;
        } else if (err) {
          console.log(err);
          sendJSONresponse(res, 404, err);
          return;
        }
        sendJSONresponse(res, 200, block);
      });
};

/* GET a block by the id */
module.exports.blockReadOne = function(req, res) {
  if (req.params && req.params.blockid) {
    Block
      .findById(req.params.blockid)
      .exec(function(err, block) {
        if (!block) { sendJSONresponse(res, 404, {"message": "blockid not found"});
          return;
        } else if (err) {
          sendJSONresponse(res, 404, err);
          return;
        }
        sendJSONresponse(res, 200, block);
      });
  } else {
    sendJSONresponse(res, 404, { "message": "No blockid in request"});
  }
};

/* POST a new block */
/* /api/block */
module.exports.blockCreate = function(req, res) {
  Block.create({
    titulo: req.body.titulo,
    resumen:req.body.resumen,
    cuerpo: req.body.cuerpo,
    }, function(err, block) {
    if (err) {
      sendJSONresponse(res, 400, err);
    } else {
      sendJSONresponse(res, 201, block);
    }
  });
};

/* PUT /api/block/:blockid */
module.exports.blockUpdateOne = function(req, res) {
  if (!req.params.blockid) {
    sendJSONresponse(res, 404, { "message": "Not found, blockid is required"});
    return;
  }
  Block
    .findById(req.params.blockid)
    .select('-reviews')
    .exec(
      function(err, block) {
        if (!block) {
          sendJSONresponse(res, 404, { "message": "blockid not found"});
          return;
        } else if (err) {
          sendJSONresponse(res, 400, err);
          return;
        }
        block.titulo = req.body.titulo,
        block.resumen = req.body.resumen,
        block.cuerpo = req.body.cuerpo
        block.save(function(err, block) {
          if (err) {
            sendJSONresponse(res, 404, err);
          } else {
            sendJSONresponse(res, 200, block);
          }
        });
      }
  );
};

/* DELETE /api/block/:blockid */
module.exports.blockDeleteOne = function(req, res) {
  var blockid = req.params.blockid;
  if (blockid) {
    Block
      .findByIdAndRemove(blockid)
      .exec(
        function(err, block) {
          if (err) {
            sendJSONresponse(res, 404, err);
            return;
          }
          sendJSONresponse(res, 204, null);
        }
    );
  } else {
    sendJSONresponse(res, 404, { "message": "No blockid"});
  }
};
