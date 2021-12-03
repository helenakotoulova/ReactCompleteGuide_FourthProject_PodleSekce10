import React, { useState, useEffect } from "react";

//React Context is not optimized for high frequency changes (multiple changes per second)!!!!
// Na to je lepsi Redux.
// React Context je dobry pokud passujeme props skrze hodne komponent, ale nemel by byt pouzivan k tomu, aby nahradil props vsude.

// ten AuthContextProvider nakonec pouzivame v index.js

const AuthContext = React.createContext({
  // do toho contextu si muzu priradit tem properties isLoggedIn a onLogout nejakou dummy funkci,
  // protoze to beztak neni ta hdonota, ktera budou providovat.
  isLoggedIn: false,
  onLogout: () => {}, // fungovalo to i bez toho. slo i tak pasovat tu value onLogout: logoutHandler
  onLogin: (email,password) => {},
});

export const AuthContextProvider = (props) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const storedUserLoggedInInformation = localStorage.getItem("isLoggedIn");
    if (storedUserLoggedInInformation === "1") {
      setIsLoggedIn(true); // chceme aby pri reloadovani stranky zustal uzivatel prihlaseny, aniz by musel znovu zadavat prihlasovaci udaje,
      // ale takhle vytvorime infinite loop, protoze pokud to je 1 tak nastavi setIsLoggedIn na true,a kdyz se zmeni useState, tak to bezi znovu,
      // proto pridame useEffect
    }
  }, []); // tu dependency nechame takhle. spusti se to jen pri renderu (reloadu)

  const logoutHandler = () => {
    localStorage.removeItem("isLoggedIn"); // takhle se to vycisti
    setIsLoggedIn(false);
  };

  const loginHandler = () => {
      // We should of course check email and password
    // But it's just a dummy/ demo anyways

    // local Storage.setItem ma 2 vstupy - nejaky string a pak i nejaky dalsi string signalizujici, ze je to pravda. zde '1' bude logged in a '0' logged out.
    localStorage.setItem("isLoggedIn", "1"); // ten local storage nema nic spolecnyho s reactem, souvisi to s browserem. dalsi zpusob storovani by byly cookies.
    setIsLoggedIn(true);
  };
  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: isLoggedIn,
        onLogout: logoutHandler,
        onLogin: loginHandler,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
