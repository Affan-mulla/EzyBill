import ProfileNotify from './ProfileNotify';

const Navbar = () => {
  return (
    <div className="flex w-full items-center justify-end px-4 py-2.5 bg-background backdrop-blur-md border-b border-border shadow-sm sticky top-0 z-40">
      <ProfileNotify className="w-[42px]" />
    </div>
  );
};

export default Navbar;
