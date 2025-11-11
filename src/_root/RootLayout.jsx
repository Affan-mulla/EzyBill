import { Outlet } from 'react-router-dom';
import Navbar from '@/components/Shared/Navbar';
import { ScrollArea } from '@/components/ui/scroll-area';
import Sidebar from './Sidebar';

const RootLayout = () => {
  return (
    <div className="w-full flex">
      <Sidebar />
      <main className="flex-1 transition-all duration-300 ease-in-out">
        <Navbar />
        <ScrollArea className="bg-background max-h-[calc(100vh-64px)] h-full w-full">
          <Outlet />
        </ScrollArea>
      </main>
    </div>
  );
};

export default RootLayout;
