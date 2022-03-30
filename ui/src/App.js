//import './App.css';
import React from 'react';
import { ChakraProvider } from '@chakra-ui/react'

import logo from './images/logo.jpg';
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";


function App() {
  //<div><img src={logo} alt="logo"/></div>
  return (
  <ChakraProvider>
    <NavBar></NavBar>
    <Footer></Footer>
  </ChakraProvider>);
}

export default App;
