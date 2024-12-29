import { Bell, Search, User } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="border-b bg-white">
      <div className="flex h-16 items-center px-4">
        <div className="flex items-center space-x-4">
          <img src="/logo.svg" alt="LexArb" className="h-8 w-8" />
          <span className="font-semibold text-xl">LexArb</span>
        </div>
        
        <div className="flex flex-1 items-center space-x-4 px-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <input
                type="search"
                placeholder="Search..."
                className="w-full bg-gray-50 pl-9 pr-4 py-2 text-sm rounded-md border focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <Bell className="h-5 w-5" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <User className="h-5 w-5" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;