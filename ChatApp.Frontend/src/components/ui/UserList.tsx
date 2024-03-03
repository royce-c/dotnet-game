import React from "react";

interface UserListProps {
  usernames: string[];
}

const UserList: React.FC<UserListProps> = ({ usernames }) => (
  <>
    <h2>Artists:</h2>
    <ul>
      {usernames.map((name) => (
        <li key={name}>{name}</li>
      ))}
    </ul>
  </>
);

export default UserList;
