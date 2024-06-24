import { Link, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

import Tabs from "../ui/Tabs";

type TabsAppProps = "home" | "capture" | "top-regions" | "trending";

const NavSwitch = () => {
  const [state, setState] = useState<TabsAppProps>("home");
  const spanRef = useRef<HTMLSpanElement>(null);
  const location = useLocation();
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
      case "trending":
        setState("trending");
        break;
      default:
        setState("home");
        break;
    }
  }, [location]);
  return (
    <div className="justify-center items-center hidden md:flex">
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
          <Link to="/trending">
            <Tabs.Trigger value="trending" id="trending" className="w-fit">
              Trending
            </Tabs.Trigger>
          </Link>
        </Tabs.List>
      </Tabs.Root>
    </div>
  );
};

export default NavSwitch;
