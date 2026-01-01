import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [status, setStatus] = useState(localStorage.getItem("status"));

  const login = (token, status) => {
    localStorage.setItem("token", token);
    localStorage.setItem("status", status);
    setToken(token);
    setStatus(status);
  };

  const logout = () => {
    localStorage.clear();
    setToken(null);
    setStatus(null);
  };

  return (
    <AuthContext.Provider value={{ token, status, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
