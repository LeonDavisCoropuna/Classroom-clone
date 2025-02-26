import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from '../config/axios';
import { User } from '@/schemas/user.schema';


interface UserContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const userStorage = localStorage.getItem('user');
      if (userStorage) {
        setUser(JSON.parse(userStorage))
      } else {
        try {
          const { data } = await axios.get("/auth/google");
          localStorage.setItem('user', JSON.stringify(data)); // Almacenar los datos del usuario en localStorage
          setUser(data)
        } catch (error) {
          console.error('Error obteniendo los datos del usuario:', error);
          // Si no se puede obtener los datos, redirigir a la página de login
          const { data } = await axios.get("/auth/google");
          localStorage.setItem('user', JSON.stringify(data)); // Almacenar los datos del usuario en localStorage
          setUser(data)
        }
      }
    };
    fetchUserData();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
