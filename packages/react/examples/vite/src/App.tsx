import {
  PasswordReset,
  SignedIn,
  SignedOut,
  SignIn,
  SignUp,
  UserButton,
} from "@cakeauth/react";

const Home = () => {
  return (
    <>
      <SignedOut>
        <SignIn />
        <SignUp />
        <PasswordReset />
      </SignedOut>
      <SignedIn>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyItems: "center",
            minHeight: "100vh",
            height: "100%",
            width: "100%",
            paddingLeft: "480px",
          }}
        >
          <UserButton align="end" />
        </div>
      </SignedIn>
    </>
  );
};

export default Home;
