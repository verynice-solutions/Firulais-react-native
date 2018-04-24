import axios from 'axios'
import sessionActions from '../actions/sessionActions'
import {Alert} from 'react-native'
function request(params = { method: 'GET',
                            path: '/',
                            params: {},
                            onError: null,
                            beforeRequestStart: null,
                            onSuccess: null,
                            fullPath: false
                          }) {
      let body = {}

      let path = params.path

      if (params.method ==='POST' || params.method === 'PUT' || params.method === 'PATCH') {
        body = {
          data: params.params
        }
      } else {
        body = {
          params: params.params
        }
      }
      return dispatch => {
        if ( params.beforeRequestStart ) params.beforeRequestStart() ;
        axios({
          url: path,
          method: params.method,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          timeout: 90000,
          ...body
        }).then((json) => {
          if (params.onSuccess) {
            params.onSuccess(json)
          }
        }).catch((error) => {
          if (error.response) {
            if (error.response.status === 401) {
              dispatch(sessionActions.signOut())
            }
          }
          if (params.onError) {

            if (error.response) {
              params.onError(error.response)
            } else {
              params.onError(error)
            }
          }
        })
      }
}

const requestActions = {
  request,
  post: (params) => request({...params, method: 'POST'}),
  get: (params) => request({...params, method: 'GET'}),
  put: (params) => request({...params, method: 'PUT'}),
};

export default requestActions;
