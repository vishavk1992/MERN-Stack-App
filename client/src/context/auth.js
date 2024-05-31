import { useState, useEffect, useContext, createContext } from "react";
import axios from "axios";

const AuthContext = createContext(); //store authcontext varible in this

const Authprovider = ({ children }) => {
  const [auth, setAuth] = useState({
    user: null,
    token: "", // initially string
  });

  //default header //if we do not wanna set header in every pages then we can write here as default
  axios.defaults.headers.common["Authorization"] = auth?.token;

  useEffect(() => {
    const data = localStorage.getItem("auth");
    if (data) {
      const parseData = JSON.parse(data);
      setAuth({
        ...auth,
        user: parseData.user,
        token: parseData.token,
      });
    }
    // eslint-disable-next-line
  }, []);
  //useefect use to fix the data in localstorage . the data will not remove after refresh he page
  return (
    <AuthContext.Provider value={[auth, setAuth]}>
      {children}
    </AuthContext.Provider>
  );
};

//custome hook

const useAuth = () => useContext(AuthContext);

export { useAuth, Authprovider };
