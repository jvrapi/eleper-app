import React, { createContext, useState } from 'react';

interface BottomTabBarContextData {
  showTabBar: boolean;
  setShowTabBar(value: boolean): void;
}

const BottomTabBarContext = createContext<BottomTabBarContextData>({} as BottomTabBarContextData);

export const BottomTabBarProvider: React.FC = ({ children }) => {
  const [showTabBar, setShowTabBar] = useState(false);
  return <BottomTabBarContext.Provider value={{ showTabBar, setShowTabBar }}>{children}</BottomTabBarContext.Provider>;
};

export default BottomTabBarContext;
