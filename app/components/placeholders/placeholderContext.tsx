import React, { createContext, useContext, useState } from 'react';

type PlaceholderContextType = {
  activeGroup: string | null;
  setActiveGroup: (g: string | null) => void;
};

const PlaceholderContext = createContext<PlaceholderContextType>({
  activeGroup: null,
  setActiveGroup: () => {}
});

export const PlaceholderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeGroup, setActiveGroup] = useState<string | null>(null);
  return (
    <PlaceholderContext.Provider value={{ activeGroup, setActiveGroup }}>
      {children}
    </PlaceholderContext.Provider>
  );
};

export const usePlaceholderUI = () => useContext(PlaceholderContext);

export default PlaceholderContext;
