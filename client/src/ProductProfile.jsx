import { useParams } from 'react-router-dom'
import { items, models } from './data'
import { useState } from 'react'

const ProductProfile = () => {
  const [modelId, setModelId] = useState('')
  const [error, setError] = useState('')
  const [imageSrc, setImageSrc] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const { id } = useParams()
  const item = items.find((item) => item.id == id)
  const clothImage = item.imageSrc.split('/').pop()

  const handleClick = (id) => {
    if (!modelId) {
      setModelId(id)
    } else {
      if (modelId === id) {
        setModelId('')
      } else {
        setModelId(id)
      }
    }
  }

  const handleTryon = async (e) => {
    e.preventDefault()
    console.log('modelId:', modelId)
    if (!modelId) {
      setError('Please select a model')
      return
    }
    setIsLoading(true)
    const model = models.find((model) => model.id == modelId)
    const modelImage = model.imageSrc.split('/').pop()
    console.log('modelImage:', modelImage)
    console.log('clothImage:', clothImage)
    try {
      const response = await fetch('http://127.0.0.1:5000/synthesis-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          person_image: modelImage,
          cloth_image: clothImage,
        }),
      })

      if (!response.ok) throw new Error('Image synthesis failed')

      const blob = await response.blob()
      const imgSrc = URL.createObjectURL(blob)
      console.log('imgSrc:', imgSrc)
      setImageSrc(imgSrc)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="px-6 md:px-20 pt-6 w-full h-[calc(100vh-3.5rem)] ">
      <div className="grid grid-cols-2">
        <div>
          <img
            src={item.imageSrc}
            className="w-full max-w-[460px] object-contain"
            alt={item.title}
          />
        </div>
        <div className="pl-3 flex flex-col gap-3 ">
          <h1 className="text-3xl font-bold pb-3">{item.title}</h1>
          <div>
            <p>{item.price}</p>
            <p>Want to try on this item? Select a model here!</p>
          </div>
          {!imageSrc ? (
            <div className="flex flex-wrap gap-3">
              {models.map((model) => (
                <img
                  key={model.id}
                  src={model.imageSrc}
                  className={` w-40 h-40 object-contain hover:cursor-pointer ${
                    modelId === model.id ? 'border-2 border-purple-500' : ''
                  }`}
                  alt={model.title}
                  onClick={() => handleClick(model.id)}
                />
              ))}
              {error && <div className="text-red-500">{error}</div>}
              <div className="w-full flex justify-center py-6">
                <button
                  className={` text-white py-3 rounded-md w-full max-w-60 flex items-center justify-center ${
                    isLoading ? 'bg-gray-400' : 'bg-blue-500'
                  }`}
                  onClick={handleTryon}
                  disabled={isLoading}>
                  <p>Try On!</p>
                  {isLoading && (
                    <img
                      src="ZKZg.gif"
                      alt="loading"
                      className="  w-12  pl-6 "
                    />
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div>
              <img
                className="w-full max-w-96 pb-3"
                src={imageSrc}
                alt="Try On"
              />

              <button
                className="bg-blue-500 text-white px-4 py-3 rounded-md w-full max-w-80 text-center"
                onClick={() => setImageSrc('')}>
                Back
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductProfile
