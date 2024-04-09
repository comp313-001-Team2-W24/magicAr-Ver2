import { useState, useEffect } from 'react'
import Navbar from './Navbar'
import { useSearchParams } from 'react-router-dom'
import Home from './Home'
import { Routes, Route } from 'react-router-dom'
import ProductProfile from './ProductProfile'

function App() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [name, setName] = useState('')
  // const [email, setEmail] = useState('')
  const [token, setToken] = useState('')
  const code = searchParams.get('code')

  const clientID = import.meta.env.VITE_COGNITO_CLIENT_ID || ''
  const clientSecret = import.meta.env.VITE_COGNITO_CLIENT_SECRET || ''
  const cognitoDomain = import.meta.env.VITE_COGNITO_DOMAIN || ''

  const credentials = `${clientID}:${clientSecret}`
  const base64Credentials = btoa(credentials)
  const basicAuthorization = `Basic ${base64Credentials}`
  const redirectUri = 'http://localhost:5173/'

  const clearCodeFromURL = () => {
    searchParams.delete('code')
    setSearchParams(searchParams)
  }

  const handleSignOut = () => {
    sessionStorage.removeItem('access_token')
    setToken('')
    setName('')
    // setEmail('')
    const logoutUrl = `${cognitoDomain}/logout?client_id=${clientID}&logout_uri=${encodeURIComponent(
      'http://localhost:5173/'
    )}`
    window.location.href = logoutUrl
  }
  const handleLogin = () => {
    const loginUrl = `${cognitoDomain}/login?response_type=code&client_id=${clientID}&redirect_uri=${redirectUri}`
    window.location.href = loginUrl
  }

  useEffect(() => {
    const fetchData = async () => {
      if (!code) return

      const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: basicAuthorization,
      }

      const data = new URLSearchParams()
      data.append('grant_type', 'authorization_code')
      data.append('client_id', clientID)
      data.append('code', code)
      data.append('redirect_uri', redirectUri)

      try {
        const response = await fetch(`${cognitoDomain}/oauth2/token`, {
          method: 'POST',
          headers: headers,
          body: data,
        })
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`)
        const result = await response.json()
        if (!result.access_token) throw new Error('No access token in response')
        const token = result.access_token
        setToken(token)
        sessionStorage.setItem('access_token', token)
        clearCodeFromURL()
      } catch (err) {
        console.error('Error fetching access token:', err)
      }
    }

    fetchData()
  }, [code]) // eslint-disable-line

  useEffect(() => {
    const fetchUserInfo = async () => {
      const storedToken = sessionStorage.getItem('access_token')
      if (!storedToken) return

      try {
        const userInfoResponse = await fetch(
          `${cognitoDomain}/oauth2/userInfo`,
          {
            headers: { Authorization: `Bearer ${storedToken}` },
          }
        )

        if (!userInfoResponse.ok) {
          throw new Error(`HTTP error! status: ${userInfoResponse.status}`)
        }
        const userInfo = await userInfoResponse.json()
        console.log('userInfo:', userInfo)
        setName(userInfo.username)
        // setEmail(userInfo.email)
      } catch (err) {
        console.error('err:', err)
      }
    }

    fetchUserInfo()
  }, [token]) // eslint-disable-line



  return (
    <div className="w-screen h-screen ">
      <Navbar name={name} onSignOut={handleSignOut} onLogin={handleLogin} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/:id" element={<ProductProfile />} />
      </Routes>
    </div>
  )
}

export default App
