import axios from 'axios';
//import {parseString} from 'xml2js';
export default (callback) => {
  let images = [];
  var config = {
        headers: {'Origin': 'www.cincygrace.com'}
    };
  axios.get('https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=UUF0rjE7UKRDSrlFmDQ9yY3Q&key=AIzaSyB6GqjG6fOwnFEkA3c2nqBQEVREsGrnGnk'
          , config)
    .then(function (response) {
      var videos = response.data.items.map((item)=>({
        title : item.snippet.title,
        imageUrl : item.snippet.thumbnails.high.url, //big imageUrl
        videoUrl : 'https://www.youtube.com/v/'+ item.snippet.resourceId.videoId
      }))
        callback(videos);

    })
    .catch(function (response) {
      console.log(response);
    });
}
