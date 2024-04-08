import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

const Navbar = ({ name, onSignOut, onLogin }) => {
  return (
    <nav className="px-6 md:px-20  py-2 fix w-full flex gap-6 bg-white h-14  shadow-xl items-center justify-between">
      <div>
        {name ? (
          <div className="flex gap-5 items-center">
            <Link to="/">Welcome, {name}</Link>
            <button className=" bg-blue-600 text-white p-2 rounded-md">
              Upgrade
            </button>
          </div>
        ) : (
          'Welcome'
        )}
      </div>
      <div>
        {!name ? (
          <button
            className=" bg-blue-600 text-white p-2  rounded-md"
            onClick={onLogin}>
            Login
          </button>
        ) : (
          <button
            className=" bg-blue-600 text-white p-2  rounded-md"
            onClick={onSignOut}>
            Sign Out
          </button>
        )}
      </div>
    </nav>
  )
}

Navbar.propTypes = {
  onSignOut: PropTypes.func.isRequired,
  onLogin: PropTypes.func.isRequired,
  name: PropTypes.string,
}

export default Navbar
