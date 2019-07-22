const mongoose = require('mongoose');

const connection_string = process.env.DATABASE_CONNECTION_STRING || require('../config.js').DATABASE_CONNECTION_STRING;

mongoose.connect(connection_string,
  err => {
    if (err) throw err;
    console.log("connected")
  }
);
var Schema = mongoose.Schema;

let speechSchema = new Schema({
    protocolId: Number,
    time: Number,
    index:Number,
    speaker: String, //TODO: speaker id
    paragraphs: []
})
let subjectSchema = new Schema({
    protocolId: Number,
    time: Number,
    title: String
})
let assemblySchema = new Schema({
  protocolId: Number,
  videoUrl: String,
})

let memberSchema = new Schema({
  name: String,
  party: String,
  imageUrl: String,
})


let Speech = mongoose.model('Speech', speechSchema)
, Subject = mongoose.model('Subject', speechSchema)
, Assembly = mongoose.model('Assembly', speechSchema)
, Member = mongoose.model('Member', memberSchema)

module.exports = {
  addSpeechesFromAssembly: function(protocolId, speechesArray){
    return this.clearSpeechesForAssembly(protocolId)
      .then(() => Speech.insertMany(speechesArray))
      ;
  },
  clearSpeechesForAssembly: function(protocolId){
    return Speech.deleteMany({ protocolId }) // clear all speeches with this protocolId
  },
  getSpeeches: function(filter){
    return Speech.find(filter).sort('time');
  },
  addSubjectsFromAssembly: function(protocolId, subjectsArray){
    console.log(subjectsArray);
    return this.clearSubjectsForAssembly(protocolId)
      .then(() => Subject.insertMany(subjectsArray))
      ;
  },
  clearSubjectsForAssembly: function(protocolId){
    return Subject.deleteMany({ protocolId }) // clear all speeches with this protocolId
  },
  updateAssemblyDetails: function(protocolId, details){
    console.log(details);
    return Assembly.updateOne({protocolId}, { title: details.title, subtitle: details.subtitle, videoUrl: details.videoUrl  }, {upsert: true, setDefaultsOnInsert: true});
  },

  updateMembers: function(members){
    return this.clearMembers()
            .then(() => Member.insertMany(members))
    ;
  },
  clearMembers : function(){
    return Subject.deleteMany({ })
  },
  getMemberImageUrlByName: function(name){
    return Member.findOne({name}).then(member => member.imageUrl);
  }


};
