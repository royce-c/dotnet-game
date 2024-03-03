import React from "react";

interface UserListProps {
  usernames: string[];
}

const UserList: React.FC<UserListProps> = ({ usernames }) => (
  <div className="p-4">
    <>
      <h2 className="text-lg font-bold mb-4">Artists:</h2>
      <div className="grid grid-cols-3 gap-4">
        {usernames.map((name) => (
          <div key={name} className="bg-gray-200 p-2 rounded-md">
            {name}
          </div>
        ))}
      </div>
    </>
  </div>
);

export default UserList;
