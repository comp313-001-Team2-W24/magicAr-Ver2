import Card from './components/Card'
import { items } from './data'

const Home = () => {
  return (
    <div className="px-6 md:px-20 pt-6 w-full h-[calc(100vh-3.5rem)] ">
      <div className="py-3 text-center   bg-gradient-to-r from-violet-400 to-fuchsia-400">
        <h1 className=" text-3xl font-bold pb-3 text-white">
          New markdowns! Up to 60% off{' '}
        </h1>
        <p className="text-white">
          Score big with the latest styles from $5.99
        </p>
      </div>
      <div className="grid grid-cols-4 justify-evenly pt-6">
        {items.map((item) => (
          <Card key={item.id} {...item} />
        ))}
      </div>
    </div>
  )
}

export default Home
