import "./App.css";
import React from "react";
import { ChakraProvider } from "@chakra-ui/react";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import Features from "./components/Features";
import Description from "./components/Description";
import WaitingRoom from "./components/WaitingRoom";
import AuctionCreationForm from "./components/AuctionCreationForm";
import AuctionPage from "./components/AuctionPage";
import Newsletter from "./components/Newsletter";
import { useState } from "react";
import LoginCard from "./components/Login";
import SignupCard from "./components/Register";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  return (
    <Router>
      <ChakraProvider>
        <NavBar
          setShowLogin={setShowLogin}
          setShowRegister={setShowRegister}
        ></NavBar>
        {showLogin && <LoginCard onLoginChange={setShowLogin} />}
        {showRegister && <SignupCard onRegisterChange={setShowRegister} />}
        <Routes>
          <Route path="/" element={<><Description/><Features/><Newsletter/></>} />
          <Route path="/waitingroom" element={<><WaitingRoom/></>} />
          <Route path="/creationForm" element={<><AuctionCreationForm/></>} />
          <Route path="/productPage" element={<><AuctionPage/></>} />
        </Routes>
        <Footer/>
      </ChakraProvider>
    </Router>
  );
}

export default App;
