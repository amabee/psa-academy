import NavbarRoutes from '@/components/shared/navbar-routes';
import MobileSidebar from './mobile-sidebar';
import SearchInput from '@/components/shared/search-input';

const Navbar = () => {
  return (
    <div className="p-4 border-b h-full flex items-center gap-x-4 bg-white dark:bg-slate-950 shadow-sm">
      <MobileSidebar />
      <SearchInput />
      <NavbarRoutes />
    </div>
  );
};

export default Navbar;