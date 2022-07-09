import "./App.css";
import React, { useEffect } from "react";
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
  Recommendation,
} from "./components";
import CollectionList from "./components/CollectionList";
import Axios from "axios";

function App() {
  return (
    <UserProvider>
      <AppHelper />
    </UserProvider>
  );
}

const AppHelper = () => {
  const { user, setUser } = React.useContext(UserContext);
  const [approved, setApproved] = React.useState(false);

  useEffect(() => {
    const token = localStorage.getItem("user");
    try {
      setUser(jwt(token));
    } catch (err) {}
  }, [setUser]);

  useEffect(() => {
    const token = localStorage.getItem("user");
    if (!token) {
      return;
    }
    const interval = setInterval(() => {
      if (approved) {
        return;
      }
      fetchApproved();
    }, 1000);
    return () => clearInterval(interval);
  }, [setUser]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchApproved = async () => {
    const token = localStorage.getItem("user");
    if (!token) {
      return;
    }
    const { data } = await Axios.get(
      "https://localhost:5000/auth/users/" + jwt(token).user_id
    );
    const user = data[0];
    setApproved(user.approved);
  };

  return (
    <Router>
      <ChakraProvider>
        <NavBar approved={approved} setApproved={setApproved} />
        {approved && Object.keys(user).length !== 0 && <Notification />}
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Description />
                <Features />
                {Object.keys(user).length !== 0 && <Recommendation />}
                <Newsletter />
              </>
            }
          />
          {!approved && Object.keys(user).length !== 0 && (
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
          {(approved || user.username === "admin") &&
            Object.keys(user).length !== 0 && (
              <Route
                path="/createauction"
                element={
                  <>
                    <AuctionCreation />
                  </>
                }
              />
            )}
          {(approved || user.username === "admin") &&
            Object.keys(user).length !== 0 && (
              <Route
                path={"/myauction/:id"}
                element={
                  <>
                    <AuctionsList />
                  </>
                }
              />
            )}
          {
              <Route
                path="/auction/:id"
                element={
                  <>
                    <AuctionPage />
                  </>
                }
              />
            }
          {(approved || user.username === "admin") &&
            Object.keys(user).length !== 0 && (
              <Route
                path={"/messaging/" + user.user_id}
                element={
                  <>
                    <Messaging />
                  </>
                }
              />
            )}
          {(approved || user.username === "admin") &&
            Object.keys(user).length !== 0 && (
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
          {(approved || user.username === "admin") &&
            Object.keys(user).length !== 0 && (
              <Route
                path="/myauctions"
                element={
                  <>
                    <CollectionList />
                  </>
                }
              />
            )}
        </Routes>
        <Footer />
      </ChakraProvider>
    </Router>
  );
};

export default App;
