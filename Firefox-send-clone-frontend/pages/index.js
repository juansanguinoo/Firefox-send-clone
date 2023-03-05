import React, { useContext, useEffect } from 'react'
import Layout from '../components/Layout'
import authContext from '../context/auth/authContext'
import appContext from '../context/app/appContext'
import Link from 'next/link'
import Dropzone from '../components/Dropzone'
import Alert from '../components/Alert'

const index = () => {

  const AuthContext = useContext(authContext)
  const { authenticatedUser } = AuthContext

  const AppContext = useContext(appContext)
  const { message_file, url } = AppContext

  useEffect(() => {
    const token = localStorage.getItem('token')
    if(token) {
      authenticatedUser()
    }
  }, [])

  return (
    <Layout>
      <div className='md:w-4/5 xl:w-3/5 mx-auto mb-32'>
        {
          url ? (
            <>
              <p className='text-center text-2xl mt-10'>
                <span className='font-bold text-red-700 text-3xl uppercase'>Your URL: </span>{`${process.env. frontedURL}/url/${url}`}
              </p>
              <button
                type='button'
                className='bg-red-500 hover:bg-gray-900 w-full p-2 text-white uppercase font-bold mt-10'
                onClick={ () => navigator.clipboard.writeText(`${process.env.frontedURL}/url/${url}`) }
              >
                Copy URL
              </button>
            </>
          ) : (
            <>
              { message_file && <Alert /> }
              <div className='lg:flex md:shadow-lg p-5 bg-white rounded-lg py-10'>
                <Dropzone />
                <div className='md:flex-1 mb-3 mx-2 mt-16 lg:mt-0'>
                  <h2 className='text-4xl font-sans font-bold text-gray-800 my-4'>Easy and private file sharing</h2>
                  <p className='text-lg leading-loose'>
                    <span className='text-red-500 font-bold'>Firefox Send</span> is a free, private file sharing service that puts the control back into your hands. Upload your files and share them with anyone you want. No registration required.
                  </p>
                  <Link href='/signIn'>
                    <p className='text-red-500 font-bold text-lg hover:text-red-700'>Create an account to get more benefits</p>
                  </Link>
                </div>
              </div>
            </>
          )}
      </div>
    </Layout>
  )
}

export default index