import { Stack, Alert, AlertIcon } from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import Axios from "axios";
import jwt from "jwt-decode";

export default function Notification() {
  const [newMessages, setNewMessages] = useState(false);
  const [user, setUser] = useState(null);
  const [receivedLength, setReceivedLength] = useState(0);

  const fetchReceivedMessages = async () => {
    let { data } = await Axios.get(
      "http://localhost:5000/messaging/" +
        jwt(localStorage.getItem("user")).user_id +
        "/inbox"
    );
    const received = data;
    setReceivedLength(received.length);

    let { data: user_data } = await Axios.get(
      "http://localhost:5000/auth/users/" +
        jwt(localStorage.getItem("user")).user_id
    );
    setUser(user_data[0]);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      fetchReceivedMessages();
    }, 1000);
    return () => clearInterval(interval);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (receivedLength === 0 || user == null) {
      setNewMessages(false);
      return;
    }
    if (receivedLength > user.messagecount) {
      setNewMessages(true);

      console.log(receivedLength, user.messagecount);
    } else {
      setNewMessages(false);
    }
  }, [user, receivedLength]);

  return (
    <Stack top={20} position={"absolute"} right={100}>
      {newMessages && <NotificationCode />}
    </Stack>
  );
}

function NotificationCode() {
  return (
    <Alert borderRadius={10} status="info">
      <AlertIcon />
      New messages!
    </Alert>
  );
}
