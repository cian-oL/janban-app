import Footer from "@/components/Footer";
import Header from "@/components/Header";
import MainSidebar from "@/components/MainSidebar";
import { useAuthContext } from "@/contexts/AuthContext";

type Props = {
  children: React.ReactNode;
};

const Layout = ({ children }: Props) => {
  const { isLoggedIn } = useAuthContext();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="container pl-0 flex-1 flex">
        {isLoggedIn && <MainSidebar />}
        <main className="h-full my-auto">{children}</main>
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
