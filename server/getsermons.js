import axios from 'axios';
import {parseString} from 'xml2js';
import fs from 'fs';
var jsmediatags = require("jsmediatags");
const baseUrl = 'http://media.cincygrace.com.s3.amazonaws.com/'
function promisifyGetId3(sermonDetail)
{
  return new Promise(function(resolve, reject) {
    new jsmediatags.Reader(baseUrl+sermonDetail.file)
      .setTagsToRead(['title', 'artist', 'album'])
      .read({
        onSuccess: function(tag) {
          if(tag.tags && tag.tags.title)
            Object.assign(sermonDetail, {title: tag.tags.title, artist: tag.tags.artist, album: tag.tags.album});
          resolve(sermonDetail);
        },
        onError: function(error) {
          console.log(':', error.type, error.info);
          reject(error);
        }
      });

    });
}
function reParseViewModel(){
    return new Promise(function(resolve, reject) {
      let sermons = {};
      axios.get(baseUrl+'?list-type=2/')
        .then(function (response) {
          parseString(response.data, (err,result)=>{
            let sermonsDetails = result.ListBucketResult
                      .Contents
                      .filter(item => /^[^\\]*\.mp3$/i.test(item.Key))
                      .map(item => {
                        var title,  artist, date,dateString, am, m, guest;
                        var re = /.*(\d{2})(\d{2})(\d{4})(AM|PM)(-|_)(.*)\.mp3/g;

                        if ((m = re.exec(item.Key)) !== null) {
                         date = new Date(m[3] ,m[1]-1 ,m[2]);
                         dateString = m[3]+'.'+m[1]+'.'+m[2];
                         am = m[4];
                         title = m[6];
                        }
                          return {title:title, date:date, dateString: dateString, am:am, file: item.Key, guest : /^guest.*/.test(item.Key)};
                      });
            var promises = [];
            sermonsDetails.forEach((sermonDetail)=>{
                promises.push(promisifyGetId3(sermonDetail));
            })
            Promise.all(promises).then((sermonDetails) => {
                console.log('All promises resolved',sermonDetails.length);
                sermons.mainSermons = sermonsDetails.filter(s=>!s.guest);
                sermons.guestSermons =sermonsDetails.filter(s =>s.guest);
                resolve(sermons);
            }, function(err) {
                // error occurred
                console.log('errors occurred' + err);
                reject(err);
            });
          });
        })
        .catch(function (response) {
          console.log(response);
          reject(err);
        });
    });
}
function saveViewModelToFs (cachedSermons){
  fs.writeFile("cachedSermons.ch",JSON.stringify( cachedSermons), function(err) {
      if(err) {
          return console.log(err);
      }
      console.log("The file was saved!");
  });
}
function readFromFs(onSuccess){
  fs.readFile('cachedSermons.ch', 'utf8', function (err, data) {
    var returnVal;
    if (err) console.log(err);
    else returnVal = JSON.parse(data);
     onSuccess(returnVal);
  });
}

// sermonFetcher
export default () => {
 var cachedSermons;
  return (callback) => {
    if(cachedSermons){
      console.log('getting sermons from memory');
      callback(cachedSermons);
    }
    else {
      readFromFs((sermons)=>{
        if(sermons) {
          console.log('getting sermons from file');
          callback(sermons);
          cachedSermons = sermons;
        }
        else {
          reParseViewModel().then((sermons)=> {
            console.log('getting sermons from network');
            cachedSermons = sermons;
            callback(sermons)
            saveViewModelToFs(sermons);
            },
            ()=> callback({}));
        }
      });
    }
  }
}
