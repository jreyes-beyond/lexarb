import { Home, FileText, Calendar, MessageSquare, Book, Settings } from 'lucide-react';
import { Link } from '@tanstack/react-router';

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Cases', href: '/cases', icon: FileText },
  { name: 'Calendar', href: '/calendar', icon: Calendar },
  { name: 'Messages', href: '/messages', icon: MessageSquare },
  { name: 'Legal Repository', href: '/repository', icon: Book },
  { name: 'Settings', href: '/settings', icon: Settings },
];

const Sidebar = () => {
  return (
    <aside className="w-64 min-h-screen bg-white border-r">
      <nav className="p-4 space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              to={item.href}
              className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700 hover:text-primary"
            >
              <Icon className="h-5 w-5" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;