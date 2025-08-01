import { useState } from "react";
import { createContext } from "react";



// import uuid from 'react-native-uuid';

export const DataContext = createContext();

export default function DataContextProvider(props) {

  const [user, setUser] = useState();
  const [userPref, setUserPref] = useState();

  return (
    <DataContext.Provider value={{ setUser, setUserPref, user, userPref}}>
      {props.children}
    </DataContext.Provider>
  )
}