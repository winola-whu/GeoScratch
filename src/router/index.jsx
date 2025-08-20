import { createBrowserRouter } from 'react-router-dom'
import Layout from '@/layout/Layout'
import Home from '@/pages/Home'
// import App from '../App'
const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
    ],
  },
  // {
  //   path: '/a',
  //   element: <App />,
  // }
])

export default router
