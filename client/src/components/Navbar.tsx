import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store";
import { clearCredentials } from "../store/authSlice";
import { Display } from "./ui/Display";
import Tabs from "./ui/Tabs";
import { Title } from "./ui/Title";
import Button from "./ui/Button";

type TabsAppProps = "home" | "capture" | "top-regions";

const Navbar: React.FC = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const [state, setState] = useState<TabsAppProps>("home");
  const spanRef = useRef<HTMLSpanElement>(null);
  const location = useLocation();

  const handleLogout = () => {
    dispatch(clearCredentials());
  };

  useEffect(() => {
    const activeTrigger = document.getElementById(state) as HTMLElement;
    if (spanRef.current) {
      spanRef.current.style.left = activeTrigger.offsetLeft + "px";
      spanRef.current.style.width = activeTrigger.offsetWidth + "px";
    }
  }, [state]);

  useEffect(() => {
    const path = location.pathname.split("/")[1];

    switch (path) {
      case "home":
        setState("home");
        break;
      case "capture":
        setState("capture");
        break;
      case "top-regions":
        setState("top-regions");
        break;
      default:
        setState("home");
        break;
    }
  }, [location]);

  return (
    <nav className="bg-transparent p-4 w-full flex items-center justify-between flex-col md:flex-row gap-4">
      <Link to="/">
        <Display size={"4xl"}>Map Capture</Display>
      </Link>
      <div className="flex-grow flex justify-center items-center">
        <Tabs.Root className="space-y-4" defaultValue={state} onValueChange={(value) => setState(value as TabsAppProps)}>
          <Tabs.List size="lg" intent="gray" data-shade="925" variant="soft" triggerVariant="plain">
            <Tabs.Indicator ref={spanRef} variant="elevated" />
            <Link to="/home">
              <Tabs.Trigger value="home" id="home">
                Home
              </Tabs.Trigger>
            </Link>
            <Link to="/capture">
              <Tabs.Trigger value="capture" id="capture">
                Capture
              </Tabs.Trigger>
            </Link>
            <Link to="/top-regions">
              <Tabs.Trigger value="top-regions" id="top-regions" className="w-fit">
                Top
              </Tabs.Trigger>
            </Link>
          </Tabs.List>
        </Tabs.Root>
      </div>
      <div className="flex items-center">
        <Title className="mr-10">{user ? "Hi, " + user.username[0].toUpperCase() + user.username.slice(1) : ""}</Title>
        <Button.Root variant="ghost" onClick={handleLogout}>
          <Button.Label>Logout</Button.Label>
        </Button.Root>
      </div>
    </nav>
  );
};

export default Navbar;
