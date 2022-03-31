import './App.css';
import React from 'react';
import { ChakraProvider } from '@chakra-ui/react'
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import Features from "./components/Features";
import Description from "./components/Description";
import Newsletter from "./components/Newsletter";
import { useState } from 'react';
import LoginCard from './components/Login';
import SignupCard from './components/Register';

function App() {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  return (
  <ChakraProvider>
    <NavBar setShowLogin={setShowLogin} setShowRegister={setShowRegister}></NavBar>
    { showLogin && <LoginCard onLoginChange={setShowLogin}/> }
    { showRegister && <SignupCard onRegisterChange={setShowRegister}/> }
    <Description></Description>
    <Features></Features>
    <Newsletter></Newsletter>
    <Footer></Footer>
  </ChakraProvider>);
}

export default App;
