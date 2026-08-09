import { useEffect, useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import SignInPage from './pages/SignInPage'
import SignUpPage from './pages/SignUpPage'
<<<<<<< HEAD
import SSOCallback from './pages/SSOCallback'
import TestPage from './pages/TestPage'
=======
import {AuthContextProvider} from "./Features/auth/auth.context.jsx";
>>>>>>> 3f6469b83d139e2b547e4cd586038e0a7d63e3c3

function getInitialTheme() {
  if (typeof window === 'undefined') return 'dark'
  const stored = window.localStorage.getItem('theme')
  const initialTheme = stored === 'light' || stored === 'dark' ? stored : 'dark'
  document.documentElement.dataset.theme = initialTheme
  return initialTheme
}

function App() {
  const [theme, setTheme] = useState(getInitialTheme)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    window.localStorage.setItem('theme', theme)
  }, [theme])

  return (
<<<<<<< HEAD
    <Routes>
      <Route
        path="/"
        element={<LandingPage theme={theme} setTheme={setTheme} />}
      />

      <Route
        path="/sign-in/sso-callback"
        element={<SSOCallback />}
      />

      <Route
        path="/sign-up/sso-callback"
        element={<SSOCallback />}
      />

      <Route
        path="/sign-in/*"
        element={<SignInPage />}
      />

      <Route
        path="/sign-up/*"
        element={<SignUpPage />}
      />

      <Route
        path="/test-page"
        element={<TestPage theme={theme} setTheme={setTheme} />}
      />

      <Route
        path="*"
        element={<Navigate replace to="/" />}
      />
    </Routes>
=======
    <AuthContextProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage theme={theme} setTheme={setTheme} />} />
          <Route path="/sign-in" element={<SignInPage />} />
          <Route path="/sign-up" element={<SignUpPage />} />
          <Route path="*" element={<Navigate replace to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthContextProvider>
>>>>>>> 3f6469b83d139e2b547e4cd586038e0a7d63e3c3
  )
}

export default App