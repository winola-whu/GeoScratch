import geometry from '@/assets/icon/geometry.svg'
import operators from '@/assets/icon/MathOperations.svg'
import measurements from '@/assets/icon/measurement.svg'

const CategoryToolbarAside = () => {
  // Light Theme: bg-gray-50 when hovered: bg-gray-200
  // Dark Theme
  return (
    <>
      <div className="bg-gray-50">

        <div className="h-[8rem] flex items-center justify-center hover:bg-gray-200">
          <div className="flex flex-col items-center">
            <img src={geometry} className="w-10 h-10" />
            <p className='text-sm mt-2.5'>Geometric Objects</p>
          </div>
        </div>

        <div className="h-[8rem] flex items-center justify-center hover:bg-gray-200">
          <div className="flex flex-col items-center">
            <img src={operators} className="w-10 h-10" />
            <p className='text-sm mt-2.5'>Operators</p>
          </div>
        </div>

        <div className="h-[8rem] flex items-center justify-center hover:bg-gray-200">
          <div className="flex flex-col items-center">
            <img src={measurements} className="w-10 h-10" />
            <p className='text-sm mt-2.5'>Measurements</p>
          </div>
        </div>
      </div>
    </>
  )
}

export default CategoryToolbarAside
