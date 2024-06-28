// GlobalStateContext.js
import React, { createContext, useState, useContext } from "react";

const GlobalStateContext = createContext();

export const GlobalStateProvider = ({ children }) => {
  const [login, setLogin] = useState(false);

  return (
    <GlobalStateContext.Provider value={{ login, setLogin }}>
      {children}
    </GlobalStateContext.Provider>
  );
};

export const useGlobalState = () => useContext(GlobalStateContext);
