
import { Show, SignInButton, SignUpButton, UserButton } from '@clerk/react'
function ClerkLogin() {
  return (
    <>
      <header>
        <Show when="signed-out">
          <SignInButton />
          <SignUpButton />
        </Show>
        <Show when="signed-in">
          <UserButton />
        </Show>
      </header>
    </>
  )
}
export default ClerkLogin;