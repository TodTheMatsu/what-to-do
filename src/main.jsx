import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Signup from './Signup.jsx'
import Login from './Login.jsx'
const router = createBrowserRouter([
  {
    path: '/what-to-do',
    element: <App />,
    errorElement: <div>Page Not Found</div>,
  },
  {
    path: '/what-to-do/signup',
    element: <Signup />, 
    errorElement: <div>Page Not Found</div>,
  },
  {
    path: '/what-to-do/login',
    element: <Login />, 
    errorElement: <div>Page Not Found</div>,
  }
])

createRoot(document.getElementById('root')).render(
 // <StrictMode>
    <RouterProvider router={router} />
  //</StrictMode>,
)
