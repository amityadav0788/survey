"use strict";
var util = require('util');
var visionGoogle = require('../../api/visionGoogle');
var async = require('async');

var vision_google = {
  upload : function(req,res,next){
    var params = "";
    visionGoogle.upload(params,function(err,data){
      if(err){

      }
      else
      {
        res.json(data);
      }
    })
  }
};

module.exports = vision_google;
