import Footer from "@/components/Footer";
import Header from "@/components/Header";
import MainNavigation from "@/components/MainNavigation";
import { useAuthContext } from "@/contexts/AuthContext";

type Props = {
  children: React.ReactNode;
};

const Layout = ({ children }: Props) => {
  const { isLoggedIn } = useAuthContext();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex flex-col lg:flex-row">
        {isLoggedIn && <MainNavigation />}
        <main className="flex-1 w-full px-4 mx-auto">{children}</main>
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
