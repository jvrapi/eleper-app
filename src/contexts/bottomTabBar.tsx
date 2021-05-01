import React, { createContext, useState } from 'react';

interface BottomTabBarContextData {
  showTabBar: boolean;
  setShowTabBar(value: boolean): void;
  showPlusButton: boolean;
  setShowPlusButton(value: boolean): void;
  plusButtonRoute: string;
  setPlusButtonRoute(value: string): void;
}

const BottomTabBarContext = createContext<BottomTabBarContextData>({} as BottomTabBarContextData);

export const BottomTabBarProvider: React.FC = ({ children }) => {
  const [showTabBar, setShowTabBar] = useState(false);
  const [showPlusButton, setShowPlusButton] = useState(false);
  const [plusButtonRoute, setPlusButtonRoute] = useState('');

  const providerValue = {
    showTabBar,
    setShowTabBar,
    showPlusButton,
    setShowPlusButton,
    plusButtonRoute,
    setPlusButtonRoute,
  };

  return <BottomTabBarContext.Provider value={providerValue}>{children}</BottomTabBarContext.Provider>;
};

export default BottomTabBarContext;
