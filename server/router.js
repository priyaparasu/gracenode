import express from 'express';
import getImages from './getimages';
import getVideos from './getvideos';
import getSermons from './getsermons';
import s3browserupload from './s3browserupload';
import passport from 'passport';
import authenticationMiddleware from './authenticationMiddleware';

var router = express.Router();
var sermonFetcher = getSermons();
let activeMap = {
  '/'               :     { title: 'Home',        active: { home: 'active'    }},
  '/aboutus'        :     { title: 'About us',    active: { aboutus: 'active' }},
  '/aboutus/pastor' :     { title: 'Pastor',      active: { aboutus: 'active', pastor: 'active' }},
  '/aboutus/gallery':     { title: 'Gallery',     active: { aboutus: 'active', gallery: 'active' }},
  '/contactus'      :     { title: 'Contact Us',  active: { contactus: 'active'}},
  '/events'         :     { title: 'Events',      active: { events: 'active'}},
  '/videos'         :     { title: 'Videos',      active: { sermons: 'active', videos: 'active'}},
  '/sermons'        :     { title: 'Sermons',     active: { sermons: 'active', sermons: 'active'}}
//  ,'/admin'          :     { title: 'Admin'        active: { admin: 'active' }}
  }
router.get('/', (req, res) =>{
  getImages('banners',(images)=>{
    res.render('home', Object.assign(activeMap[req.path], {images}));
  });

});
router.get('/aboutus', (req, res) => {
    res.render('believe', activeMap[req.path]);
});
router.get('/aboutus/pastor', (req, res) => {
    res.render('pastor', activeMap[req.path]);
});
router.get('/aboutus/gallery', (req, res)=>{
  getImages('ImageGallery',(images)=>{
    res.render('gallery', Object.assign(activeMap[req.path], {images}));
  });
});
router.get('/contactus', (req, res) => {
    res.render('contactus',activeMap[req.path]);
});
router.get('/events', (req, res) => {
    res.render('events',activeMap[req.path]);
});
router.get('/videos', (req, res) => {
  getVideos((videos)=>{
    res.render('videos', Object.assign(activeMap[req.path], {videos}));
  });
});
router.get('/sermons', (req, res) => {
  sermonFetcher((sermons)=>{
    res.render('sermons', Object.assign(activeMap[req.path], {sermons}));
  });
});
router.get('/login', (req, res) => {
    res.render('login', activeMap[req.path]);
});

router.post('/login',
  passport.authenticate('local', {
      successRedirect: '/admin',
      failureRedirect: '/login',
      failureFlash : true
    })
);

/// admin routes

// Automatically apply the `requireLogin` middleware to all
// routes starting with `/admin`
router.all("/admin*", authenticationMiddleware(), function(req, res, next) {
  next(); // if the middleware allowed us to get here,
          // just move on to the next route handler
});

router.get('/admin', (req, res)=>{
  getImages('banners',(images)=>{
    res.render('admin/index', Object.assign({layout: 'admin'}, {images}));
  });
})

var s3Config = {
  accessKey: process.env.S3_ACCESS_KEY,
  secretKey: process.env.S3_SECRET_KEY,
  bucket: process.env.S3_BUCKET,
  region: process.env.S3_REGION
};

router.get('/s3_credentials', function(request, response) {
  if (request.query.filename) {
    //console.log("s3_credentials", request.query.filename);
       var filename  = "banners/"+request.query.filename;
        var s3Creds = s3browserupload.s3Credentials(s3Config, filename);
        //console.log(s3Creds);
        response.json(s3Creds);
  } else {
    response.status(400).send('filename is required');
  }
});
module.exports = router;
