import React from "react";

interface ContainerProps {
  children: React.ReactNode;
}

const Container: React.FC<ContainerProps> = ({ children }) => {
  return (
    <div className="w-full min-h-screen bg-gray-300">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        {children}
      </div>
    </div>
  );
}

export default Container;
