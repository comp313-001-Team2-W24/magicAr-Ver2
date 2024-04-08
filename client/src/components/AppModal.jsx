import PropTypes from 'prop-types'

AppModal.propTypes = {
  showModal: PropTypes.bool.isRequired,
  setShowModal: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
}

export default function AppModal({ showModal, setShowModal, children }) {
  return (
    <div
      className={`${showModal ? 'fixed' : 'hidden'} inset-0 z-50`}
      onMouseDown={() => setShowModal(false)}>
      <div
        className={`justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none `}>
        <div className="relative w-full my-6 mx-auto max-w-3xl min-w-1/2">
          <div
            className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none"
            onMouseDown={(e) => e.stopPropagation()}>
            {/*close modal icon*/}
            <p
              className="fas fa-times absolute right-0 -top-14 text-white m-4 text-gray cursor-pointer text-3xl hover:text-graydark"
              onClick={() => setShowModal(false)}>
              x
            </p>
            {children}
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </div>
  )
}
