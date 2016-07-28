"use strict";

var util = require('util');

var vision_google = require('./vision_google');


/**
 * @module ADMIN API
 */
module.exports = function(app) {


  /**
   * **GET /v1/seller/packages.json**
   * lists packages of seller
   *
   * @api {GET} /v1/seller/packages.json
   *
   * @param {String} packageid - package id
   * @param {String} package_sku - package sku
   */
  //app.get('/v1/seller/packages.json', vision_google.fetch);

  /**
   *
   * **POST /v1/seller/packages.json**
   *
   * @param {object} body - body params
   * @param {object[]} body.data - array of packages
   * @param {string} data[].name  - pacakge name
   * @param {string} data[].destination - destination keywords
   * @param {string[]} data[].location  -  array of locations covered
   * @param {string} data[].description - short description
   * @param {string} data[].details
   *
   */
  app.post('/v1/survey/upload.json', vision_google.upload);


  /**
   * **POST /v1/seller/packages.json**
   *
   * @param {object[]} data - array of packages
   * @param {string} data[].name - name
   *
   */
  //app.put('/v1/seller/packages.json', vision_google.validation, vision_google.update);


};
