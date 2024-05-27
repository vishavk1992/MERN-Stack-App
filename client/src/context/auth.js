import { useState, useEffect, useContext, createContext } from "react";

const AuthContext = createContext(); //store authcontext varible in this

const Authprovider = ({ children }) => {
  const [auth, setAuth] = useState({
    user: null,
    token: "", // initially string
  });
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
  }, [auth]); //useefect use to fix the data in localstorage . the data will not remove after refresh he page
  return (
    <AuthContext.Provider value={[auth, setAuth]}>
      {children}
    </AuthContext.Provider>
  );
};

//custome hook

const useAuth = () => useContext(AuthContext);

export { useAuth, Authprovider };
