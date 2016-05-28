import express from 'express';
import getImages from './getimages';
import getVideos from './getVideos';


var router = express.Router();
let activeMap = {
  '/'               :     { title: 'Home',        active: { home: 'active'    }},
  '/aboutus'        :     { title: 'About us',    active: { aboutus: 'active' }},
  '/aboutus/pastor' :     { title: 'Pastor',      active: { aboutus: 'active', pastor: 'active' }},
  '/aboutus/gallery':     { title: 'Gallery',     active: { aboutus: 'active', gallery: 'active' }},
  '/contactus'      :     { title: 'Contact Us',  active: { contactus: 'active'}},
  '/events'         :     { title: 'Events',      active: { events: 'active'}},
  '/videos'         :     { title: 'Videos',      active: { sermons: 'active', videos: 'active'}}
  }
router.get('/', function(req, res) {
  console.log(req.path)
    res.render('home', activeMap[req.path]);
});
router.get('/aboutus', (req, res) => {
    res.render('believe', activeMap[req.path]);
});
router.get('/aboutus/pastor', (req, res) => {
    res.render('pastor', activeMap[req.path]);
});
router.get('/aboutus/gallery', (req, res)=>{
  getImages((images)=>{
    res.render('gallery', Object.assign(activeMap[req.path], {images: images}));
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
    res.render('videos', Object.assign(activeMap[req.path], {videos: videos}));
  });
});
module.exports = router;
