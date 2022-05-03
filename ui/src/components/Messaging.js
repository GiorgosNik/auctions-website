import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Box,
  CloseButton,
  Flex,
  Icon,
  useColorModeValue,
  Link,
  Drawer,
  DrawerContent,
  useDisclosure,
  BoxProps,
  FlexProps,
  Button,
  FormControl,
  FormLabel,
  Input,
  HStack,
  Textarea,
  Text,
  TableCaption,
} from "@chakra-ui/react";

import { FiHome, FiSend, FiPlus } from "react-icons/fi";
import React, { useState, useEffect, ReactNode } from "react";
import Axios from "axios";
import { IconType } from "react-icons";
import { ReactText } from "react";
import { useLocation } from "react-router-dom";
import jwt from "jwt-decode";

interface LinkItemProps {
  name: string;
  icon: IconType;
}
const LinkItems: Array<LinkItemProps> = [
  { name: "Inbox", icon: FiHome },
  { name: "Sent", icon: FiSend },
];

export default function Messaging({ children }: { children: ReactNode }) {
  const { isOpen, onClose } = useDisclosure();
  const [sentMessages, setSentMessages] = useState([]);
  const [receivedMessages, setReceivedMessages] = useState([]);
  const [newMessage, setNewMessage] = useState(false);
  const [inbox, setInbox] = useState(true);
  const [sent, setSent] = useState(false);
  const [messageDetails, setMessageDetails] = useState(false);
  const location = useLocation();
  const [message, setMessage] = useState("");
  const [subject, setSubject] = useState("");
  const [receiver, setReceiver] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [openedMessage, setOpenMessage] = useState("");
  const [inboxLength] = useState(0);

  useEffect(() => {
    if (receivedMessages.length === 0) {
      return;
    }
    var receivedLength = receivedMessages.length;
    const body = {
      receivedLength,
    };

    fetch(
      "http://localhost:5000/auth/users/" +
        jwt(localStorage.getItem("user")).user_id +
        "/messages",
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }
    );
  }, [receivedMessages]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchSentMessages();
      fetchReceivedMessages();
    }, 1000);
    return () => clearInterval(interval);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  let handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  let handleSubjectChange = (e) => {
    setSubject(e.target.value);
  };

  let handleReceiverChange = (e) => {
    setReceiver(e.target.value);
  };

  const deleteMessage = async (id) => {
    await Axios.delete("http://localhost:5000/messaging/" + id);
    window.location.href = location.pathname;
  };
  const openMessage = async (id) => {
    setOpenMessage(id);
    setInbox(false);
    setSent(false);
    setNewMessage(false);
    setMessageDetails(true);
  };

  const SendMessage = (event) => {
    event.preventDefault();
    const body = {
      subject,
      receiver,
      message,
    };

    try {
      fetch("http://localhost:5000" + location.pathname, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
        .then((res) => res.json())
        .then(async (res) => {
          if (res?.error) {
            setErrorMessage(res?.error);
          } else {
            setErrorMessage("");
            window.location.href = location.pathname;
          }
        });
    } catch (err) {
      console.error(err.message);
    }
  };

  const fetchSentMessages = async () => {
    let { data } = await Axios.get(
      "http://localhost:5000" + location.pathname + "/sent"
    );
    const sent = data;
    setSentMessages(sent);
  };

  const fetchReceivedMessages = async () => {
    let { data } = await Axios.get(
      "http://localhost:5000" + location.pathname + "/inbox"
    );
    const received = data;
    setReceivedMessages(received);
  };

  return (
    <Box
      minH="100vh"
      bg={useColorModeValue("gray.100", "gray.900")}
      display="flex"
    >
      <SidebarContent
        inboxLength={inboxLength}
        onClose={() => onClose}
        setNewMessage={setNewMessage}
        setInbox={setInbox}
        setSent={setSent}
        setMessageDetails={setMessageDetails}
        display={{ base: "none", md: "block" }}
        minH="100vh"
      />
      <Drawer
        autoFocus={false}
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full"
      >
        <DrawerContent>
          <SidebarContent
            inboxLength={inboxLength}
            onClose={onClose}
            setNewMessage={setNewMessage}
            setInbox={setInbox}
            setSent={setSent}
            setMessageDetails={setMessageDetails}
          />
        </DrawerContent>
      </Drawer>

      {messageDetails && (
        <MessageDetails openedMessage={openedMessage}></MessageDetails>
      )}

      {inbox && (
        <TableContainer w={1000} p={10}>
          <Table variant="simple" colorScheme="purple">
            <TableCaption placement="top" fontSize={30}>
              Inbox
            </TableCaption>

            <Thead>
              <Tr>
                <Th>Sender</Th>
                <Th>Subject</Th>
                <Th>Date</Th>
                <Th></Th>
                <Th></Th>
              </Tr>
            </Thead>
            <Tbody>
              {receivedMessages.map((message, index) => {
                return (
                  <InboxMessage
                    message={message}
                    index={index}
                    openMessage={openMessage}
                    deleteMessage={deleteMessage}
                  ></InboxMessage>
                );
              })}
            </Tbody>
          </Table>
        </TableContainer>
      )}
      {sent && (
        <TableContainer w={1000} p={10}>
          <Table variant="simple" colorScheme="purple">
            <TableCaption placement="top" fontSize={30}>
              Sent Messages
            </TableCaption>
            <Thead>
              <Tr>
                <Th>Sender</Th>
                <Th>Subject</Th>
                <Th>Date</Th>
                <Th></Th>
                <Th></Th>
              </Tr>
            </Thead>
            <Tbody>
              {sentMessages.map((message, index) => {
                return (
                  <SentMessage
                    message={message}
                    index={index}
                    openMessage={openMessage}
                    deleteMessage={deleteMessage}
                  ></SentMessage>
                );
              })}
            </Tbody>
          </Table>
        </TableContainer>
      )}

      {newMessage && (
        <Box w={1000} p={10}>
          <HStack>
            <FormControl>
              <FormLabel htmlFor="subject">Subject:</FormLabel>
              <Input
                id="subject"
                placeholder="Thank you!"
                bg={"white"}
                onChange={handleSubjectChange}
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel htmlFor="receiver">To:</FormLabel>
              <Input
                id="receiver"
                placeholder="seller1995"
                bg={"white"}
                onChange={handleReceiverChange}
              />
            </FormControl>
          </HStack>
          <>
            <br></br>
            <Text mb="8px">Message:</Text>
            <Textarea
              id="message"
              borderRadius={10}
              bg={"white"}
              onChange={handleMessageChange}
              placeholder="Here is a sample placeholder"
              size="sm"
            />
          </>
          {errorMessage !== "" && (
            <span id="message" style={{ color: "red", fontSize: "15px" }}>
              <br></br>
              {errorMessage}
              <br></br>
            </span>
          )}
          <Button
            marginTop={10}
            fontSize={"sm"}
            fontWeight={600}
            color={"white"}
            bg={"purple.400"}
            _hover={{
              bg: "purple.300",
            }}
            onClick={SendMessage}
          >
            Send
          </Button>
        </Box>
      )}
    </Box>
  );
}

const InboxMessage = ({ message, index, openMessage, deleteMessage }) => {
  return (
    <Tr key={index}>
      <Td>{message.sender}</Td>
      {message.subject === "" && <Td>(no subject)</Td>}
      {message.subject !== "" && <Td>{message.subject}</Td>}
      <Td>{message.date}</Td>
      <Td>
        <Button
          colorScheme="red"
          variant="outline"
          onClick={() => deleteMessage(message.id)}
        >
          Delete
        </Button>
      </Td>
      <Td>
        <Button
          colorScheme="green"
          variant="outline"
          onClick={() => openMessage(message.id)}
        >
          Open
        </Button>
      </Td>
    </Tr>
  );
};

const SentMessage = ({ message, index, openMessage, deleteMessage }) => {
  return (
    <Tr key={index}>
      <Td>{message.receiver}</Td>
      {message.subject === "" && <Td>(no subject)</Td>}
      {message.subject !== "" && <Td>{message.subject}</Td>}
      <Td>{message.date}</Td>
      <Td>
        <Button
          colorScheme="red"
          variant="outline"
          onClick={() => deleteMessage(message.id)}
        >
          Delete
        </Button>
      </Td>
      <Td>
        <Button
          colorScheme="green"
          variant="outline"
          onClick={() => openMessage(message.id)}
        >
          Open
        </Button>
      </Td>
    </Tr>
  );
};

interface SidebarProps extends BoxProps {
  onClose: () => void;
}

const SidebarContent = ({
  onClose,
  setNewMessage,
  setInbox,
  setSent,
  setMessageDetails,
  inboxLength,
  ...rest
}: SidebarProps) => {
  return (
    <Box
      bg={useColorModeValue("white", "gray.900")}
      borderRight="1px"
      borderRightColor={useColorModeValue("gray.200", "gray.700")}
      w={{ base: "full", md: 60 }}
      h="full"
      {...rest}
    >
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <CloseButton display={{ base: "flex", md: "none" }} onClick={onClose} />
      </Flex>

      <NavItem
        color={"white"}
        bg={"purple.400"}
        icon={FiPlus}
        setNewMessage={setNewMessage}
        setInbox={setInbox}
        setSent={setSent}
        setMessageDetails={setMessageDetails}
      >
        New
      </NavItem>
      {LinkItems.map((link) => (
        <NavItem
          key={link.name}
          icon={link.icon}
          setNewMessage={setNewMessage}
          setInbox={setInbox}
          setSent={setSent}
          setMessageDetails={setMessageDetails}
        >
          {link.name}
        </NavItem>
      ))}
    </Box>
  );
};

interface NavItemProps extends FlexProps {
  icon: IconType;
  children: ReactText;
}
const NavItem = ({
  icon,
  children,
  setNewMessage,
  setInbox,
  setSent,
  setMessageDetails,
  ...rest
}: NavItemProps) => {
  const createMessage = () => {
    setNewMessage(true);
    setInbox(false);
    setSent(false);
    setMessageDetails(false);
  };
  const showInbox = () => {
    setInbox(true);
    setNewMessage(false);
    setSent(false);
    setMessageDetails(false);
  };

  const showSent = () => {
    setSent(true);
    setNewMessage(false);
    setInbox(false);
    setMessageDetails(false);
  };
  var functionToCall;
  if (children === "New") {
    functionToCall = createMessage;
  } else if (children === "Inbox") {
    functionToCall = showInbox;
  } else if (children === "Sent") {
    functionToCall = showSent;
  }
  return (
    <Link
      onClick={functionToCall}
      style={{ textDecoration: "none" }}
      _focus={{ boxShadow: "none" }}
    >
      <Flex
        align="center"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        _hover={{
          bg: "purple.400",
          color: "white",
        }}
        {...rest}
      >
        {icon && (
          <Icon
            mr="4"
            fontSize="16"
            _groupHover={{
              color: "white",
            }}
            as={icon}
          />
        )}
        {children}
      </Flex>
    </Link>
  );
};

function MessageDetails({ openedMessage }) {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchMessage(openedMessage);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchMessage = async (id) => {
    const { data } = await Axios.get("http://localhost:5000/messaging/" + id);
    const message = data[0];
    if (message.subject === "") {
      message.subject = "(no subject)";
    }

    setMessage(message);
  };

  return (
    <Box
      minH="100vh"
      bg={useColorModeValue("gray.100", "gray.900")}
      display="flex"
    >
      <Box w={1000} p={10}>
        <HStack>
          <FormControl>
            <FormLabel htmlFor="sender">From:</FormLabel>
            <Input
              id="input"
              placeholder={message.sender}
              bg={"white"}
              readOnly
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="receiver">To:</FormLabel>
            <Input
              id="input"
              placeholder={message.receiver}
              bg={"white"}
              readOnly
            />
          </FormControl>
        </HStack>
        <br></br>
        <HStack>
          <FormControl>
            <FormLabel htmlFor="subject">Subject:</FormLabel>
            <Input
              id="input"
              placeholder={message.subject}
              bg={"white"}
              readOnly
            />
          </FormControl>

          <FormControl>
            <FormLabel htmlFor="date">Date:</FormLabel>
            <Input
              id="input"
              placeholder={message.date}
              bg={"white"}
              readOnly
            />
          </FormControl>
        </HStack>

        <>
          <br></br>
          <Text mb="8px">Message:</Text>
          <Textarea
            id="input"
            borderRadius={10}
            bg={"white"}
            placeholder={message.text}
            size="sm"
            readOnly
          />
        </>
      </Box>
    </Box>
  );
}
