import axios from 'axios';
//import {parseString} from 'xml2js';
export default (maxResults,callback) => {
  let images = [];
  var config = {
        headers: {'Origin': 'www.cincygrace.com'}
    };
    var url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=${maxResults}&playlistId=UUF0rjE7UKRDSrlFmDQ9yY3Q&key=AIzaSyB6GqjG6fOwnFEkA3c2nqBQEVREsGrnGnk`
console.log(url);
  axios.get(url, config)
    .then(function (response) {
      var videos = response.data.items.map((item)=>({
        title : item.snippet.title,
        imageUrl : item.snippet.thumbnails.high.url, //big imageUrl
        videoUrl : 'https://www.youtube.com/v/'+ item.snippet.resourceId.videoId,
        description: item.snippet.description
      }))
        callback(videos);

    })
    .catch(function (response) {
      console.log(response);
    });
}
