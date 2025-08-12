import { useAuth } from "@clerk/clerk-react";

import HomePageTile from "@/components/HomePageTile";
import SignInTile from "@/components/SignInTile";

const HomePage = () => {
  const { isSignedIn } = useAuth();

  return <>{isSignedIn ? <HomePageTile /> : <SignInTile />}</>;
};

export default HomePage;
