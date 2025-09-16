import React from "react";
import type { HeaderProps } from "../props/Header.props";

export const Header = React.memo(({ avatarUrl }: HeaderProps) => {
  return (
    <header className="w-full flex items-center px-6 py-4 bg-[var(--bg-color)] shadow-md">
      <div className="ml-auto">
        <img
          src={avatarUrl}
          alt="User Avatar"
          className="w-10 h-10 rounded-full border-2 border-gray-300 dark:border-gray-600 object-cover"
        />
      </div>
    </header>
  );
});
