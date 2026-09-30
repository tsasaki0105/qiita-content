import { useAuth0 } from '@auth0/auth0-react'
import './App.css'

function LoginButton() {
  const { loginWithRedirect } = useAuth0()
  return <button onClick={() => loginWithRedirect()}>Log In</button>
}

function LogoutButton() {
  const { logout } = useAuth0()
  return (
    <button
      onClick={() =>
        logout({ logoutParams: { returnTo: window.location.origin } })
      }
    >
      Log Out
    </button>
  )
}

function Profile() {
  const { user } = useAuth0()
  return (
    <div>
      <img src={user.picture} alt={user.name} width="80" />
      <h2>{user.name}</h2>
      <p>{user.email}</p>
    </div>
  )
}

function App() {
  const { isLoading, isAuthenticated } = useAuth0()

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <section id="center">
      <h1>Auth0 React Quickstart</h1>
      {isAuthenticated ? (
        <>
          <Profile />
          <LogoutButton />
        </>
      ) : (
        <LoginButton />
      )}
    </section>
  )
}

export default App
