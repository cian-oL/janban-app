import { useAuth } from "@clerk/clerk-react";

import HomePageTile from "@/components/landing/HomePageTile";
import SignInTile from "@/components/auth/SignInTile";

const HomePage = () => {
  const { isSignedIn } = useAuth();

  return <>{isSignedIn ? <HomePageTile /> : <SignInTile />}</>;
};

export default HomePage;
