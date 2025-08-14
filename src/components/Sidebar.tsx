'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { RxDashboard } from 'react-icons/rx';
import { LuNotebookPen } from 'react-icons/lu';
import { SlSettings } from 'react-icons/sl';
import { IoLogOutOutline } from 'react-icons/io5';
import { Button } from '@/components/ui/button';
import useLogout from '../app/logout/page';
export default function Sidebar() {
  const handleLogout=useLogout ();
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;


  return (
    <aside className="w-64 bg-white border-r shadow-sm flex flex-col justify-between px-4 py-6">
      <div>
        <div className="flex items-center gap-2 mb-8 px-2">
          <div className="w-3 h-3 bg-black rotate-45" />
          <span className="text-lg">Wellness Hub</span>
        </div>

        <nav className="space-y-1">
          <Link href="/dashboard">
            <div className={`flex items-center gap-2 px-3 py-2 rounded-md font-medium hover:bg-gray-100 
              ${isActive('/') ? 'bg-yellow-100 text-gray-700' : 'text-gray-700'}`}>
              <span><RxDashboard /></span> Dashboard
            </div>
          </Link>

          <Link href="/chatwithAI">
            <div className={`flex items-center gap-2 px-3 py-2 rounded-md font-medium hover:bg-gray-100 
              ${isActive('/chat-with-ai') ? 'bg-yellow-100 text-gray-700' : 'text-gray-700'}`}>
              <span><LuNotebookPen /></span> Chat With AI
            </div>
          </Link>

          <Link href="/settings">
            <div className={`flex items-center gap-2 px-3 py-2 rounded-md font-medium hover:bg-gray-100 
              ${isActive('/settings') ? 'bg-yellow-100 text-gray-700' : 'text-gray-700'}`}>
              <span><SlSettings /></span> Settings
            </div>
          </Link>
        </nav>
      </div>

      <Button onClick={handleLogout}
      className="bg-teal-200 hover:bg-teal-300 text-black w-full rounded-lg px-4 py-2 mt-8">
        <IoLogOutOutline /> Logout
      </Button>
    </aside>
  );
}
