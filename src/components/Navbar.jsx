import { fetchUser } from "@/lib/fetchUser.js";
import Link from "next/link";
import Logout from "./Logout.jsx";
import Image from "next/image";
//import JoinCommunityButton from "./JoinCommunityButton.jsx";

export default async function Navbar() {
  const user = await fetchUser();
  return (
    <div id="navbar">
      <div id="logo-container">
        <Image id="robot" src="/robot.svg" alt="robot" width={40} height={40} />
        <Image id="logo" src="/logo.svg" alt="logo" width={90} height={60} />
      </div>
      <div id="navbar-home-container" className="navbar-link-containers">
        <Link className="navbar-links" href={"/"}>
          <Image
            id="home-icon"
            src="/home_icon_temp.png"
            alt="Home Icon"
            width={50}
            height={50}
          />
        </Link>
      </div>
      {/* <div id="navbar-subreddits-container" className="navbar-link-containers">
        <Link className="navbar-links" href={"/subreddits"}>
          Subreddits
        </Link>
      </div> */}
      {!user && (
        <div id="navbar-login-join-container">
          {/* <JoinCommunityButton /> */}
          <div id="navbar-join-container" className="navbar-link-containers">
            <Link className="navbar-links" href={"/register"}>
              Join
            </Link>
          </div>{" "}
          <div id="navbar-login-container" className="navbar-link-containers">
            <Link id="navbar-link" className="navbar-links" href={"/login"}>
              Log In
            </Link>
          </div>
        </div>
      )}
      {user && (
        <>
          <span>
            Welcome,{" "}
            <Link className="links" href={`/users/${user.id}/posts`}>
              {user.username}
            </Link>
            !
          </span>
          <Logout />
        </>
      )}
    </div>
  );
}
