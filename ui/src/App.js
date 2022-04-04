import "./App.css";
import React from "react";
import jwt from "jwt-decode";
import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import {
  NavBar,
  Footer,
  Features,
  Description,
  WaitingRoom,
  AuctionCreationForm,
  Newsletter,
  UserContext,
  UserProvider,
  UsersList,
  UserPage,
  AuctionPage,
  AuctionsList,
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

  React.useEffect(() => {
    const token = localStorage.getItem("user");
    try {
      setUser(jwt(token));
    } catch (err) {}
  }, [setUser]);

  return (
    <Router>
      <ChakraProvider>
        <NavBar />
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
            path="/creationForm"
            element={
              <>
                <AuctionCreationForm />
              </>
            }
          />
          <Route
            path="/auctions"
            element={
              <>
                <AuctionsList />
              </>
            }
          />
          <Route
            path="/productPage"
            element={
              <>
                <AuctionPage />
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
