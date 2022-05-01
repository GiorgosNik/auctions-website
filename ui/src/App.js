import "./App.css";
import React, { useState, useEffect } from "react";
import jwt from "jwt-decode";
import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import {
  NavBar,
  Footer,
  Features,
  Description,
  WaitingRoom,
  Newsletter,
  UserContext,
  UserProvider,
  UsersList,
  UserPage,
  AuctionCreation,
  AuctionPage,
  AuctionsList,
  Messaging,
  EditAuction,
  Notification,
} from "./components";

function App() {
  return (
    <UserProvider>
      <AppHelper />
    </UserProvider>
  );
}

const AppHelper = () => {
  const { setUser } = React.useContext(UserContext);

  useEffect(() => {
    const token = localStorage.getItem("user");
    try {
      setUser(jwt(token));
    } catch (err) {}
  }, [setUser]);

  return (
    <Router>
      <ChakraProvider>
        <NavBar />
        <Notification />
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Description />
                <Features />
                <Newsletter />
              </>
            }
          />
          <Route
            path="/waitingroom"
            element={
              <>
                <WaitingRoom />
              </>
            }
          />
          <Route
            path="/users"
            element={
              <>
                <UsersList />
              </>
            }
          />
          <Route
            path="/users/:userId"
            element={
              <>
                <UserPage />
              </>
            }
          />
          <Route
            path="/createauction"
            element={
              <>
                <AuctionCreation />
              </>
            }
          />
          <Route
            path="/myauctions/:userId"
            element={
              <>
                <AuctionsList />
              </>
            }
          />
          <Route
            path="/auction/:id"
            element={
              <>
                <AuctionPage />
              </>
            }
          />
          <Route
            path="/messaging/:userId"
            element={
              <>
                <Messaging />
              </>
            }
          />
          <Route
            path="/editauction/:id"
            element={
              <>
                <EditAuction />
              </>
            }
          />
        </Routes>
        <Footer />
      </ChakraProvider>
    </Router>
  );
};

export default App;
