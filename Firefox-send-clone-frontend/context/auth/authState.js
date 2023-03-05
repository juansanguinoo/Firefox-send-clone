import React, { useReducer } from "react";
import authContext from "./authContext";
import authReducer from "./authReducer";

import { 
  REGISTER_SUCCESS, 
  REGISTER_ERROR, 
  CLEAN_ALERT, 
  LOGIN_SUCCESS, 
  LOGIN_ERROR, 
  AUTHENTICATED_USER, 
  LOG_OUT
} from "../../types";

import instance from "../../config/axios";
import authToken from "../../config/authToken";

const AuthState = ({children}) => {

  const initialState = {
    token: typeof window !== 'undefined' ? localStorage.getItem('token') : '',
    authenticated: null,
    user: null,
    message: null,
    loading: null
  }

  const [state, dispatch] = useReducer(authReducer, initialState);

  const signInUser = async data => {
    try {
      const response = await instance.post('/api/users', data);
      dispatch({
        type: REGISTER_SUCCESS,
        payload: response.data.msg
      })
    } catch (error) {
      dispatch({
        type: REGISTER_ERROR,
        payload: error.response.data.msg
      })
    }
    setTimeout(() => {
      dispatch({
        type: CLEAN_ALERT
      })
    }, 3000);
  }

  const logInUser = async data => {
    try {
      const response = await instance.post('/api/auth', data);
      localStorage.setItem('token', response.data.token);
      dispatch({
        type: LOGIN_SUCCESS,
        payload: response.data.token
      })
    } catch (error) {
      console.log(error)
      dispatch({
        type: LOGIN_ERROR,
        payload: error.response.data.msg
      })
    }
    setTimeout(() => {
      dispatch({
        type: CLEAN_ALERT
      })
    }, 3000);
  }

  const authenticatedUser = async () => {
    const token = localStorage.getItem('token');
    if(token) {
      authToken(token);

      try {
      const response = await instance.get('/api/auth')
      if (response.data.user) {
        dispatch({
          type: AUTHENTICATED_USER,
          payload: response.data.user
        })
      }
      } catch (error) {
        dispatch({
          type: LOGIN_ERROR,
          payload: error.response.data.msg
        })
      }
    }
  }

  const logOutUSer = () => {
    localStorage.removeItem('token');
    dispatch({
      type: LOG_OUT
    })
  }

  return (
    <authContext.Provider
      value={{
        token: state.token,
        authenticated: state.authenticated,
        user: state.user,
        message: state.message,
        loading: state.loading,
        signInUser,
        logInUser,
        authenticatedUser,
        logOutUSer
      }}
    >
      {children}
    </authContext.Provider>
  )
}

export default AuthState;