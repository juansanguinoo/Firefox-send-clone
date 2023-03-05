import React, { useReducer } from "react";
import instance from "../../config/axios";
import appContext from "./appContext";
import appReducer from "./appReducer";
import { 
  SHOW_ALERT,
  CLEAN_ALERT,
  UPLOAD_FILE,
  UPLOAD_FILE_SUCCESS, 
  UPLOAD_FILE_ERROR, 
  CREATE_URL_SUCCESS, 
  CREATE_URL_ERROR,
  CLEAN_STATE,
  ADD_PASSWORD,
  ADD_DOWNLOADS
} from "../../types";

const AppState = ({children}) => {

  const initialState = {
    message_file: null,
    name: '',
    original_name: '',
    loading: null,
    downloads: 1,
    password: '',
    author: null,
    url: ''
  }

  const [state, dispatch] = useReducer(appReducer, initialState)

  const showAlert = msg => {
    dispatch({
      type: SHOW_ALERT,
      payload: msg
    })
    setTimeout(() => {
      dispatch({
        type: CLEAN_ALERT
      })
    }, 3000);
  }

  const uploadFile = async (formData, fileName) => {
    dispatch({
      type: UPLOAD_FILE
    })
    try {
      const response = await instance.post('/api/files', formData)
      dispatch({
        type: UPLOAD_FILE_SUCCESS,
        payload: {
          name: response.data.file,
          original_name: fileName
        }
      })
    } catch (error) {
      console.log(error)
      dispatch({
        type: UPLOAD_FILE_ERROR,
        payload: error.response.data.msg
      })
    }
  }

  const createURL = async () => {
    const data = {
      name: state.name,
      originalName: state.original_name,
      downloads: state.downloads,
      password: state.password,
      author: state.author
    }

    try {
      const response = await instance.post('/api/url', data)
      dispatch({
        type: CREATE_URL_SUCCESS,
        payload: response.data.msg
      })
    } catch (error) {
      console.log(error)
    }
  }

  const cleanState = () => {
    dispatch({
      type: CLEAN_STATE
    })
  }

  const addPassword = password => {
    dispatch({
      type: ADD_PASSWORD,
      payload: password
    })
  }

  const addDownloads = downloads => {
    dispatch({
      type: ADD_DOWNLOADS,
      payload: downloads
    })
  }


  return (
    <appContext.Provider
      value={{
        message_file: state.message_file,
        name: state.name,
        original_name: state.original_name,
        loading: state.loading,
        downloads: state.downloads,
        password: state.password,
        author: state.author,
        url: state.url,
        showAlert,
        uploadFile,
        createURL,
        cleanState,
        addPassword,
        addDownloads
      }}
    >
      {children}
    </appContext.Provider>
  )
}

export default AppState;