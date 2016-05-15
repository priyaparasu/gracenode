import express from 'express';
import axios from 'axios';
import {parseString} from 'xml2js';

var router = express.Router();

router.get('/', function(req, res) {

    res.render('home', {
        title: 'Home',
        active: {
            home: 'active'
        }
    });
});
router.get('/aboutus', function(req, res) {
    res.render('believe', {
        title: 'About us',
        active: {
          aboutus: 'active'
        }
    });
});
router.get('/aboutus/pastor', function(req, res) {
    res.render('pastor', {
        title: 'Pastor',
        active: {
          aboutus: 'active',
          pastor: 'active'
        }
    });
});
router.get('/aboutus/gallery', function(req, res) {
  let images = [];
  axios.get('http://media.cincygrace.com.s3.amazonaws.com/?list-type=2&prefix=ImageGallery/')
    .then(function (response) {
      //console.log(Object.keys(response));
      parseString(response.data, (err,result)=>{
        images = result.ListBucketResult
                  .Contents
                  .map(item => item.Key)
                  .filter(key => /.*\.(png|jpg)$/i.test(key));
                  
        res.render('gallery', {
            title: 'Gallery',
            active: {
              aboutus: 'active',
              gallery: 'active'
            },
            images: images
        });
      });
    })
    .catch(function (response) {
      console.log(response);
    });


});

module.exports = router;
