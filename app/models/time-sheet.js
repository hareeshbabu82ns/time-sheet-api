var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var TimeSheetSchema = new Schema({
  name: String
});

module.exports = mongoose.model("TimeSheet", TimeSheetSchema);
