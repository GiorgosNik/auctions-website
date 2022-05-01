import { Stack, Alert, AlertIcon } from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import Axios from "axios";
import jwt from "jwt-decode";

export default function Notification() {
  const [newMessages, setNewMessages] = useState(false);
  const [inboxLength, setInboxLength] = useState(0);

  const fetchReceivedMessages = async () => {
    let { data } = await Axios.get(
      "http://localhost:5000/messaging/" +
        jwt(localStorage.getItem("user")).user_id +
        "/inbox"
    );
    const received = data;
    console.log(received.length, inboxLength);
    // if (inboxLength !== 0 && received.length > inboxLength) {
    //   setNewMessages(true);
    // } else {
    //   setNewMessages(false);
    // }
    // setInboxLength(received.length);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      fetchReceivedMessages();
    }, 1000);
    return () => clearInterval(interval);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // useEffect(() => console.log({ inboxLength }), [inboxLength]);

  return (
    <Stack top={100} position={"absolute"} right={100}>
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
