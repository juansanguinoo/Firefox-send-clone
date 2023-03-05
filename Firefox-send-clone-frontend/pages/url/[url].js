import Layout from "../../components/Layout";
import instance from "../../config/axios";
import { useState, useContext } from "react";
import appContext from "../../context/app/appContext";
import Alert from "../../components/Alert";

export async function getServerSideProps({ params}) {
  const { url } = params;

  const response = await instance.get(`/api/url/${url}`)

  return {
    props: {
      url: response.data
    }
  }

}

export async function getServerSidePaths() {

  const urls = await instance.get('/api/url')

  return {
    paths: urls.data.urls.map((url) => ({
      params: { url: url.url } 
    })),
    fallback: false
  }
}

export default ({url}) => {

  const AppContext = useContext(appContext);
  const { showAlert, message_file } = AppContext;

  const [hasPassword, setHasPassword] = useState(url.password);
  const [password, setPassword] = useState('');

  const verifyPassword = async (e) => {
    e.preventDefault();

    const data = {
      password
    }

    try {
      const response = await instance.post(`/api/url/${url.url}`, data)
      setHasPassword(response.data.password)
    } catch (error) {
      showAlert(error.response.data.msg)
    }
  }

  return (
    <Layout>
      {
        hasPassword ? (
          <>
            <p className="text-center">This link is password protected</p>
            {
              message_file && <Alert />
            }
            <div className="container mx-auto">
              <div className="flex justify-center mt-5">
                <div className="w-full max-w-lg">
                  <form 
                    className="bg-white rounded shadow-md px-8 pt-6 pb-8 mb-4"
                    onSubmit={ e => verifyPassword(e) }
                  >
                    <div className="mb-4">
                      <label 
                        className="block text-black text-sm font-bold mb-2" 
                        htmlFor="password"
                        >Password
                      </label>
                      <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="password"
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={ e => setPassword(e.target.value) }
                      />
                    </div>
                      <input
                        type="submit"
                        className="bg-red-500 hover:bg-gray-900 w-full p-2 text-white uppercase font-bold"
                        value="Validate Password"
                      />
                  </form>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <h1 className="text-4xl text-center text-gray-700">Download your file</h1>
            <div className="flex items-center justify-center mt-10">
              <a 
                className="bg-red-500 text-center px-10 py-3 rounded text-white uppercase font-bold cursor-pointer" 
                href={`${process.env.backendURL}/api/files/${url.url}`}
                >Download
              </a>
            </div>
          </>
        )
      }
    </Layout>
  )
}