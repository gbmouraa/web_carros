import type { ReactNode } from "react";

export const Container = ({ children }: { children: ReactNode }) => {
  return <div className="mx-auto w-full max-w-7xl px-4">{children}</div>;
};
