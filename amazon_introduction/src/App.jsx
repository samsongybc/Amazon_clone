import React, { useContext, useEffect } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'
// import Header from './Components/Header/Header'
// import CarouselEffect from './Components/Carousel/CarouselEffect'
// import Catagory from './Components/Catagory/Catagory'
// import Product from './Components/product/Product'
import Routing from './Pages/Router'
import { auth } from './Utility/firebase'
import { DataContext } from './Components/DataProvider/DataProvider'
import { Type } from './Utility/action.type'


function App() {
  const [{user}, dispatch] = useContext(DataContext);
  
    
    useEffect(() => {
      auth.onAuthStateChanged((authUser) => {
        if (authUser) {
          dispatch({type: Type.SET_USER, user: authUser})
        } else {
          dispatch({type: Type.SET_USER, user: null})
        }
      })
     
    }, []);


    return <Routing/>
    

}

export default App
