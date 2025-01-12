import Footer from "@/components/Footer";
import Header from "@/components/Header";
import NewNavbar from "@/components/NewNavbar";
import { useAuthContext } from "@/contexts/AuthContext";

type Props = {
  children: React.ReactNode;
};

const Layout = ({ children }: Props) => {
  const { isLoggedIn } = useAuthContext();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="my-5 container flex-1">
        {isLoggedIn && <NewNavbar />}
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
