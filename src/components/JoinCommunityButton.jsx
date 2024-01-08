import Link from "next/link";

export default function JoinCommunityButton() {
  return (
    <div id="join-community-button-container">
      <Link id="join-community-button-link" href={"/register"}>
        Start Posting Now
      </Link>
    </div>
  );
}
