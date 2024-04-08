import { useState, useEffect } from 'react'
import Navbar from './Navbar'
import { useSearchParams } from 'react-router-dom'
import Home from './Home'
import { Routes, Route } from 'react-router-dom'
import ProductProfile from './ProductProfile'

function App() {
  // const [imageSrc, setImageSrc] = useState('')
  // const [personImageSrc, setPersonImageSrc] = useState('')
  // const [clothImageSrc, setClothImageSrc] = useState('')
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

  // const handlePersonImageUpload = (event) => {
  //   const file = event.target.files[0]
  //   if (file) {
  //     const reader = new FileReader()
  //     reader.onloadend = () => {
  //       setPersonImageSrc(reader.result)
  //     }
  //     reader.readAsDataURL(file)
  //   }
  // }

  // const handleClothImageUpload = (event) => {
  //   const file = event.target.files[0]
  //   if (file) {
  //     const reader = new FileReader()
  //     reader.onloadend = () => {
  //       setClothImageSrc(reader.result)
  //     }
  //     reader.readAsDataURL(file)
  //   }
  // }

  // const handleImageUpload = async (event) => {
  //   event.preventDefault()

  //   const formData = new FormData()
  //   formData.append('person_image', event.target.person_image.files[0])
  //   formData.append('cloth_image', event.target.cloth_image.files[0])

  //   try {
  //     const response = await fetch('http://127.0.0.1:5000/synthesis-image', {
  //       method: 'POST',
  //       body: formData,
  //     })

  //     if (!response.ok) throw new Error('Image synthesis failed')

  //     const blob = await response.blob()
  //     const imageSrc = URL.createObjectURL(blob)
  //     setImageSrc(imageSrc)
  //   } catch (error) {
  //     console.error('Error:', error)
  //   }
  // }

  return (
    <div className="w-screen h-screen ">
      <Navbar name={name} onSignOut={handleSignOut} onLogin={handleLogin} />

      {/* <div className=" w-2/3 px-6 mt-10 mx-auto flex  gap-6   min-h-[400px] ">
        <form
          onSubmit={handleImageUpload}
          className="flex flex-col gap-3 w-1/2 p-3 ">
          <div className="flex flex-col">
            <label htmlFor="person_image">Person Image:</label>
            <input
              type="file"
              id="person_image"
              name="person_image"
              required
              onChange={handlePersonImageUpload}
            />

            {personImageSrc && (
              <img src={personImageSrc} className="w-32" alt="Person Image" />
            )}
          </div>

          <div className="flex flex-col">
            <label htmlFor="cloth_image">Cloth Image:</label>
            <input
              type="file"
              id="cloth_image"
              name="cloth_image"
              required
              onChange={handleClothImageUpload}
            />

            {clothImageSrc && (
              <img src={clothImageSrc} className="w-32" alt="Cloth Image" />
            )}
          </div>

          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-md w-fit"
            type="submit">
            Try On!
          </button>
        </form>
        <div className=" p-6">
          {imageSrc && <img src={imageSrc} className=" w-80" alt="" />}
        </div>
      </div> */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/:id" element={<ProductProfile />} />
      </Routes>
    </div>
  )
}

export default App
