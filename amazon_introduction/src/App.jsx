import React, { useContext, useEffect } from "react";
import "./App.css";
import Routing from "./Pages/Router";
import { auth } from "./Utility/firebase";
import { DataContext } from "./Components/DataProvider/DataProvider";
import { Type } from "./Utility/action.type";

function App() {
  const [{ user }, dispatch] = useContext(DataContext);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        dispatch({ type: Type.SET_USER, user: authUser });
      } else {
        dispatch({ type: Type.SET_USER, user: null });
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [dispatch]);

  return <Routing />;
}

export default App;
