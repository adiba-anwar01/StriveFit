import { createContext, useState, useEffect, useContext } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, db } from '../config/Firebase';
import { auth } from '../config/Firebase';

//Create Context
const UserContext = createContext();

//Custom Hook for consuming context
export const useAuth = () => useContext(UserContext);

//Provider Component
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);         
  const [userData, setUserData] = useState(null); 
  const [loading, setLoading] = useState(true);   


  //Fetch user Firestore data by UID
  const fetchUserData = async (uid) => {
    try {
      const ref = doc(db, 'users', uid);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setUserData(snap.data());
      }
    } catch (error) {
      console.error('❌ Error fetching user data:', error);
    }
  };

  //Listen for Auth State Change
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true);
      if (currentUser) {
        setUser(currentUser);
        await fetchUserData(currentUser.uid);
      } else {
        setUser(null);
        setUserData(null);
      }
      setLoading(false);
    });

    return () => unsubscribe(); 
  }, []);

  return (
    <UserContext.Provider value={{ user, userData, setUserData, loading }}>
      {children}
    </UserContext.Provider>
  );
};

//Export Context for direct use if needed
export { UserContext };
