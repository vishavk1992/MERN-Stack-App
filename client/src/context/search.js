import { useState, useContext, createContext } from "react";

const SearchContext = createContext(); //store authcontext varible in this

const Searchprovider = ({ children }) => {
  const [auth, setAuth] = useState({
    keyword: "",
    results: [],
  });

  return (
    <SearchContext.Provider value={[auth, setAuth]}>
      {children}
    </SearchContext.Provider>
  );
};

//custome hook

const useSearch = () => useContext(SearchContext);

export { useSearch, Searchprovider };
