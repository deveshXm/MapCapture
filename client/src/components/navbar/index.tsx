import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import Button from "../ui/Button";
import { Title } from "../ui/Title";
import NavSwitch from "./NavSwitch";
import NavDrawer from "./NavDrawer";
import { Display } from "../ui/Display";

import { RootState } from "../../store";
import { clearCredentials } from "../../store/authSlice";

const Navbar = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    dispatch(clearCredentials());
  };

  const userName = user ? "Hi, " + user.username[0].toUpperCase() + user.username.slice(1) : "";

  return (
    <nav className="bg-transparent p-4 w-full flex items-center justify-between flex-row gap-4 min-h-24">
      <Link to="/">
        <Display size={"4xl"}>Map Capture</Display>
      </Link>
      <NavSwitch />
      <div className="items-center justify-center hidden md:flex">
        <Title className="mr-10">{userName}</Title>
        <Button.Root variant="soft" onClick={handleLogout}>
          <Button.Label>Logout</Button.Label>
        </Button.Root>
      </div>
      <div className="flex md:hidden">
        <NavDrawer logout={handleLogout} />
      </div>
    </nav>
  );
};

export default Navbar;
