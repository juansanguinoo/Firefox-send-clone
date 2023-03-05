import React, { useContext, useEffect } from 'react'
import Link from 'next/link'
import authContext from '../context/auth/authContext'
import appContext from '../context/app/appContext'
import { useRouter } from 'next/router'

const Header = () => {

  const AuthContext = useContext(authContext)
  const { authenticatedUser, user, logOutUSer } = AuthContext

  const AppContext = useContext(appContext)
  const { cleanState } = AppContext

  useEffect(() => {
    authenticatedUser()
  }, [])

  const router = useRouter()

  const redirectToHome = () => {
    router.push('/')
    cleanState()
  }

  return (
    <header className="py-8 flex flex-col md:flex-row items-center justify-between">
      <img 
        src="/506 logo.svg" 
        alt="Firefox Send" 
        className="w-64 mb-8 md:mb-0 cursor-pointer"
        onClick={() => redirectToHome()} 
      />

      <div>
        {
          user ? (
            <div className='flex items-center'>
              <p className='mr-2'>Hi {user.name}</p>
              <button
                type="button"
                className="bg-black px-5 py-3 rounded-lg text-white font-bold uppercase"
                onClick={() => logOutUSer()}
              >Log Out
              </button>
            </div>
          ) : (
            <>
              <Link href="/login">
                <p className="bg-red-500 px-5 py-3 rounded-lg text-white font-bold uppercase mb-2">Login</p>
              </Link>
              <Link href="/signIn">
                <p className="bg-black px-5 py-3 rounded-lg text-white font-bold uppercase">Sign In</p>
              </Link>
            </>
          )
        }
      </div>
    </header>
  )
}

export default Header

            