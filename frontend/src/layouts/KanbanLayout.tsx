import Footer from "../components/Footer";
import Header from "../components/Header";
import MainNavbar from "@/components/MainNavbar";

type Props = {
  children: React.ReactNode;
};

const KanbanLayout = ({ children }: Props) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-1 flex flex-col lg:flex-row">
        <MainNavbar />
        <main className="w-full mx-0 py-10 flex-1">{children}</main>
      </div>
      <Footer />
    </div>
  );
};

export default KanbanLayout;
