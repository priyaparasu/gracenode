import axios from 'axios';
import {parseString} from 'xml2js';
export default (folderName,callback) => {
  let images = [];
  axios.get('http://media.cincygrace.com.s3.amazonaws.com/?list-type=2&prefix='+folderName+'/')
    .then(function (response) {
      console.log('callback: ', callback);
      parseString(response.data, (err,result)=>{
        images = result.ListBucketResult
                  .Contents
                  .map(item => item.Key)
                  .filter(key => /.*\.(png|jpg)$/i.test(key));
        callback(images);

      });
    })
    .catch(function (response) {
      console.log(response);
    });
}
