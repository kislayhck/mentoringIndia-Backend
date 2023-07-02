const mongoose = require('mongoose')



const QA_Schema = new mongoose.Schema({
  question: {
    type: String,
    required: true
  },
  options: [{
    value: {
      type: String,
      required: true
    },
    isTrue: {
      type: Boolean,
      default: false
    }
  }],
},
{ timestamps: true }
);

module.exports = mongoose.model('QA', QA_Schema);