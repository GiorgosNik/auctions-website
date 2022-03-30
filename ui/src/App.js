import './App.css';
import React from 'react';
import { ChakraProvider } from '@chakra-ui/react'
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import Features from "./components/Features";
import Description from "./components/Description";
import Newsletter from "./components/Newsletter";
import Login from "./components/Login";
import Register from "./components/Register";


function App() {
  return (
  <ChakraProvider>
    <NavBar></NavBar>
    <Description></Description>
    <Features></Features>
    <Newsletter></Newsletter>
    <Login></Login>
    <Register></Register>
    <Footer></Footer>
  </ChakraProvider>);
}

export default App;
