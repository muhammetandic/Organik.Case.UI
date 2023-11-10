import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { LoginPage } from './Login.jsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CheckCodePage } from './CheckCode.jsx';
import App from './App.jsx';
import { RegisterPage } from './Register.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />,
  },
  {
    path: "/check-code",
    element: <CheckCodePage />,
  },
  {
    path: "/profile",
    element: <App />,  
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "*",
    element: <LoginPage />,
  }
]);

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>,
)
