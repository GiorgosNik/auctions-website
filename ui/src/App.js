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
  Browse,
} from "./components";

function App() {
  return (
    <UserProvider>
      <AppHelper />
    </UserProvider>
  );
}

const AppHelper = () => {
  const { user, setUser } = React.useContext(UserContext);

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
        {Object.keys(user).length !== 0 && <Notification />}
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
          {Object.keys(user).length !== 0 && (
            <Route
              path="/waitingroom"
              element={
                <>
                  <WaitingRoom />
                </>
              }
            />
          )}
          {user.username === "admin" && (
            <Route
              path="/users"
              element={
                <>
                  <UsersList />
                </>
              }
            />
          )}
          {user.username === "admin" && (
            <Route
              path="/users/:userId"
              element={
                <>
                  <UserPage />
                </>
              }
            />
          )}
          {Object.keys(user).length !== 0 && (
            <Route
              path="/createauction"
              element={
                <>
                  <AuctionCreation />
                </>
              }
            />
          )}
          {Object.keys(user).length !== 0 && (
            <Route
              path={"/myauctions/" + user.user_id}
              element={
                <>
                  <AuctionsList />
                </>
              }
            />
          )}
          {Object.keys(user).length !== 0 && (
            <Route
              path="/auction/:id"
              element={
                <>
                  <AuctionPage />
                </>
              }
            />
          )}
          {Object.keys(user).length !== 0 && (
            <Route
              path={"/messaging/" + user.user_id}
              element={
                <>
                  <Messaging />
                </>
              }
            />
          )}
          {Object.keys(user).length !== 0 && (
            <Route
              path="/editauction/:id"
              element={
                <>
                  <EditAuction />
                </>
              }
            />
          )}
          <Route
            path="/browse"
            element={
              <>
                <Browse />
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
