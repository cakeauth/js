import {
  PasswordReset,
  SignedIn,
  SignedOut,
  SignIn,
  SignUp,
  UserButton,
} from "@cakeauth/nextjs-app";

const Home = () => {
  return (
    <>
      <SignedOut>
        <SignIn />
        <SignUp />
        <PasswordReset />
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </>
  );
};

export default Home;
