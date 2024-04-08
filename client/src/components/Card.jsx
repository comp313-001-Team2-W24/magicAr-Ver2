import { HeartIcon } from '@heroicons/react/20/solid'
import { useNavigate } from 'react-router-dom'

import PropTypes from 'prop-types'

const Card = ({ id, imageSrc, title, price }) => {
  const navigate = useNavigate()
  console.log('id:', id)

  const handleClick = () => {
    navigate(`/${id}`)
  }

  return (
    <div
      className="w-48 lg:w-80  rounded overflow-hidden shadow-lg relative"
      onClick={handleClick}>
      <img className="w-full object-contain" src={imageSrc} alt="title" />
      <div className="px-6 py-4">
        <div className="font-bold text-sm">{title}</div>
        <p className="text-gray-700 text-base">{price}</p>
      </div>
      <div className=" absolute bottom-20 right-3 hover:cursor-pointer">
        <HeartIcon className="h-8 w-8 text-gray-400" />
      </div>
    </div>
  )
}

Card.propTypes = {
  id: PropTypes.string.isRequired,
  imageSrc: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  price: PropTypes.string.isRequired,
}

export default Card
