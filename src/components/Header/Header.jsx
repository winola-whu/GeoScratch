import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const Header = () => {
  return (
    <>
      <div className="grid grid-cols-3 gap-4 px-16 h-full items-center">

        <div className="flex gap-8">

          <div>
            <FontAwesomeIcon icon="fa-solid fa-bars" className="text-2xl cursor-pointer hover:text-sky-700" /> 
          </div>

          <div>
            <FontAwesomeIcon icon="fa-solid fa-angle-left" className="text-2xl cursor-pointer hover:text-sky-700"  /> 
          </div>

          <div>
            <FontAwesomeIcon icon="fa-solid fa-angle-right" className="text-2xl cursor-pointer hover:text-sky-700" /> 
          </div>

          <div>
            <p className='text-1xl'>Home/Entities</p>
          </div>
        </div>

        <div className='text-center'>
          <p className='font-bold text-3xl'>Untitled</p>
        </div>

        <div className="flex gap-8 justify-end">
          <div>
            <FontAwesomeIcon icon="fa-solid fa-gear" className="text-2xl cursor-pointer hover:text-sky-700" />
          </div>

          <div>
            <FontAwesomeIcon icon="fa-solid fa-circle-info" className='text-2xl cursor-pointer hover:text-sky-700' />
          </div>

          <div>
            <FontAwesomeIcon icon="fa-solid fa-folder-open" className='text-2xl cursor-pointer hover:text-sky-700' />
          </div>
        </div>
      </div>
    </>
  )
}

export default Header