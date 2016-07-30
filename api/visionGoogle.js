var gcloud = require('gcloud')({
  keyFilename: '/home/amit/Documents/Codebase/packages1/src/api/visonOauth.json',
  projectId : 'cloudvisionapitest-1385'
});

var vision = gcloud.vision();

var visionGoogle = {


  upload : function(params,cb){
    var image = '/home/amit/Documents/Codebase/packages1/src/api/image.png';

   vision.detectText(image, function(err, text, apiResponse) {
      // text = ['This was text found in the image']
      console.log(err+" heheheh "+text+" ahehhehe "+JSON.stringify(apiResponse));
    });
   //cb(null,"hehehe");
  }
};

module.exports = visionGoogle;
