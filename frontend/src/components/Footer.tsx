const Footer = () => {
  return (
    <div className="bg-indigo-600 py-5">
      <footer className="container flex justify-between items-center">
        <span className="text-lg font-bold text-amber-300 hover:text-white">
          olearylab.com
        </span>
        <span className="flex gap-4 text-lg font-bold text-amber-300">
          <span className=" hover:text-white">Privacy Policy</span>
          <span className=" hover:text-white">Terms of Service</span>
        </span>
      </footer>
    </div>
  );
};

export default Footer;
