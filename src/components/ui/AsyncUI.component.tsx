import { Alert, Skeleton } from "antd";
import React from "react";
import { type AsyncUIWrapperProps } from "../props";

export const AsyncUIWrapper: React.FC<AsyncUIWrapperProps> = ({
  isLoading,
  isError,
  children,
  error,
}) => {
  if (isLoading) return <Skeleton className="h-8 w-[250px]" />;
  if (isError)
    return (
      <Alert
        description={
          <div style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
            <b>Error Happened:</b>
            {"\n"} &emsp;&emsp;&emsp;&emsp;{error?.message}
          </div>
        }
      />
    );
  return <>{children}</>;
};
