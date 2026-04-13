import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
};

function Container({ children, className = "" }: Props) {
  return (
    <div className={`mx-auto w-full max-w-310 px-4 sm:px-6 lg:px-8 ${className}`.trim()}>
      {children}
    </div>
  );
}

export default Container;
