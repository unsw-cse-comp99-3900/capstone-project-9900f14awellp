import React from "react";
import defaultAvatarImage from "@/assets/default_avatar.png";
import "./UserInfo.css";

export function UserInfo({ email, username, avatar }) {
  //   console.log("UserInfo props:", { email, username, avatar });
  //   console.log("API URL:", import.meta.env.VITE_API_URL);

  const getAvatarUrl = (avatarPath) => {
    if (!avatarPath || typeof avatarPath !== "string")
      return defaultAvatarImage;
    return `${import.meta.env.VITE_API_URL}${avatarPath}`;
  };

  const avatarUrl = getAvatarUrl(avatar);
  //   console.log("Final avatar URL:", avatarUrl);

  return (
    <div className="user-info-in-table">
      <img
        src={avatarUrl}
        alt={`${username || "User"}'s avatar`}
        className="user-avatar"
        onError={(e) => {
          console.log("Image load error, using default");
          e.target.src = defaultAvatarImage;
        }}
      />
      <div className="user-details">
        <p className="user-name">{username || "Unknown User"}</p>
        <p className="user-email">{email || "No email provided"}</p>
      </div>
    </div>
  );
}
