import React, { createContext, useState } from 'react';

export const MyContext = createContext();

export const MyContextProvider = ({ children }) => {
  const [refresh, setRefresh] = useState(false);

  return (
    <MyContext.Provider value={{ refresh, setRefresh }}>
      {children}
    </MyContext.Provider>
  );
};
