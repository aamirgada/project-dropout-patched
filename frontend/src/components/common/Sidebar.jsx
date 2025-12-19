import { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  User,
  FileText,
  Settings,
  UserCheck,
  BookOpen,
  TrendingUp,
  Calendar,
  Bell
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  // Navigation items based on role
  const getNavItems = () => {
    if (user?.role === 'student') {
      return [
        { path: '/student', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/student/profile', icon: User, label: 'My Profile' },
        { path: '/student/predictions', icon: TrendingUp, label: 'Predictions' },
        { path: '/student/sessions', icon: Calendar, label: 'Mentoring Sessions' },
        { path: '/student/notifications', icon: Bell, label: 'Notifications' }
      ];
    } else if (user?.role === 'mentor') {
      return [
        { path: '/mentor', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/mentor/students', icon: Users, label: 'My Students' },
        { path: '/mentor/sessions', icon: Calendar, label: 'Sessions' },
        { path: '/mentor/reports', icon: FileText, label: 'Reports' },
        { path: '/mentor/notifications', icon: Bell, label: 'Notifications' }
      ];
    } else if (user?.role === 'admin') {
      return [
        { path: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/admin/users', icon: Users, label: 'User Management' },
        { path: '/admin/students', icon: BookOpen, label: 'All Students' },
        { path: '/admin/mentors', icon: UserCheck, label: 'Mentors' },
        { path: '/admin/analytics', icon: TrendingUp, label: 'Analytics' },
        { path: '/admin/reports', icon: FileText, label: 'Reports' },
        { path: '/admin/settings', icon: Settings, label: 'Settings' }
      ];
    }
    return [];
  };

  const navItems = getNavItems();

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:z-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="h-full flex flex-col">
          {/* Logo/Brand */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">
              Dropout Prevention
            </h2>
            <p className="text-sm text-gray-600 mt-1 capitalize">
              {user?.role} Portal
            </p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                
                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      onClick={onClose}
                      className={`
                        flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors
                        ${active
                          ? 'bg-primary-50 text-primary-700 font-medium'
                          : 'text-gray-700 hover:bg-gray-100'
                        }
                      `}
                    >
                      <Icon className={`h-5 w-5 ${active ? 'text-primary-600' : 'text-gray-500'}`} />
                      <span>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* User Info */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="bg-primary-100 p-2 rounded-full">
                <User className="h-5 w-5 text-primary-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.name}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user?.email}
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;