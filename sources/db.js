var app, fs, mongoose;

app = require('express');
fs = require('fs');
mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/durak');
mongoose.getModel = mongoose.getModel|| {};

fs.readdir('schemas', function(err, list) {
  return list.forEach(function(file) {
    var ext, filename, schema;
    filename = file.split('.');
    filename.pop();
    filename = filename.join('.');
    ext = (file.split('.')).pop();
    if (ext === 'js') {
      schema = (require('./schemas/' + filename)(mongoose)) || null;
      if (schema !== null) {
        return mongoose.getModel[filename] = mongoose.model(filename, schema);
      }
    }
  });
});

module.exports = mongoose;
//# sourceMappingURL=db.js.map
