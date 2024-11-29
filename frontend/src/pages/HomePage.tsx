import { useAuthContext } from "@/contexts/AuthContext";
import HomePageTile from "@/components/HomePageTile";
import SignInTile from "@/components/SignInTile";

const HomePage = () => {
  const { isLoggedIn } = useAuthContext();

  return <>{isLoggedIn ? <HomePageTile /> : <SignInTile />}</>;
};

export default HomePage;
