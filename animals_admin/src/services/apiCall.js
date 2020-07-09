import axios from 'axios';
import {
  apiUrl,
} from '../validation';
import * as notification from '../utils/notification';


export default function({ dispatch ,types, customPayload, ...params }) {
  if(!apiUrl(params.url)){
    params.url = process.env.REACT_APP_TEST_API + params.url;
  }
  return new Promise((resolve, reject) => {
    dispatch({type: types[0], request: true });

    axios(params)
      .then(res => {
        const payload = customPayload || res.data;
        dispatch({
          type: types[1],
          payload,
        });
        if(params.message){
          notification.createNotification('success', params.message);
        }
      resolve(payload);
      })
      .catch(error => {
        dispatch({
          type: types[2],
          error: true,
          payload: error.response.data,
        });
        if(error.response.data.name) {
          notification.createNotification('error', error.response.data.name);
        }
        reject(error.response.data);
      });
  });
}