import { useState } from "react";
import { createContext } from "react";

// import uuid from 'react-native-uuid';

export const DataContext = createContext();

export default function DataContextProvider(props) {
  const [users, setUsers] = useState([{ id: 1, name: 'avi', pass: '123' }]);
  const [user, setUser] = useState([{}]);

  const [userImg, setUserImage] = useState({ image: null });

  let gotSms = false;

  const AddUser = (name, pass) => {
    let newUsers = [...users, { id: uuid.v4(), name, pass }];
    setUsers(newUsers);
  }

  const LoginUser = (name, pass) => {
    let res = users.find(user => user.name === name && user.pass === pass);
    console.log(res);
    return res;
  }

  const RemoveUser = (id) => {
    let newUsers = users.filter(user => user.id !== id);
    setUsers(newUsers);
  }


  const UserImage = (image) => {
    setUserImage(prev => ({ ...prev, image }));
  };

  return (
    <DataContext.Provider value={{ users, AddUser, RemoveUser, LoginUser, gotSms , userImg, UserImage , setUserImage}}>
      {props.children}
    </DataContext.Provider>
  )
}