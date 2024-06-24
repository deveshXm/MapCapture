import React from "react";
import { Link } from "react-router-dom";

import Button from "../ui/Button";
import Drawer from "../ui/Drawer";

interface NavDrawerProps {
  logout: () => void;
}

const NavDrawer: React.FC<NavDrawerProps> = ({ logout }) => {
  return (
    <Drawer.Root shouldScaleBackground>
      <Drawer.Trigger asChild>
        <Button.Root variant="soft">
          <Button.Label>Menu</Button.Label>
        </Button.Root>
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay />
        <Drawer.Content className="bg-[#121212]">
          <div className="max-w-md mx-auto mt-6 flex flex-col items-center justify-center gap-2">
            <Link to="/home">
              <Button.Root variant="soft" className="w-40">
                <Button.Label>Home</Button.Label>
              </Button.Root>
            </Link>
            <Link to="/capture">
              <Button.Root variant="soft" className="w-40">
                <Button.Label>Capture</Button.Label>
              </Button.Root>
            </Link>
            <Link to="/top-regions">
              <Button.Root variant="soft" className="w-40">
                <Button.Label>Top</Button.Label>
              </Button.Root>
            </Link>
            <Link to="/trending">
              <Button.Root variant="soft" className="w-40">
                <Button.Label>Trending</Button.Label>
              </Button.Root>
            </Link>
            <Button.Root variant="soft" onClick={logout} className="w-40">
              <Button.Label>Logout</Button.Label>
            </Button.Root>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};

export default NavDrawer;
