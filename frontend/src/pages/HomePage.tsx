import { useAuthContext } from "@/auth/AuthContext";
import HomePageTile from "@/components/HomePageTile";
import SignInTile from "@/components/SignInTile";

const HomePage = () => {
  const { accessToken } = useAuthContext();

  return <>{accessToken ? <HomePageTile /> : <SignInTile />}</>;
};

export default HomePage;
