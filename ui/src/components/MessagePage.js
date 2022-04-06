import {
  Box,
  useColorModeValue,
  Button,
  FormControl,
  FormLabel,
  Input,
  HStack,
  Textarea,
  Text,
} from "@chakra-ui/react";

import React, { useState, useEffect, ReactNode } from "react";
import Axios from "axios";
import { useLocation } from "react-router-dom";

export default function SimpleSidebar({ children }: { children: ReactNode }) {
  const location = useLocation();
  const [message, setMessage] = useState([]);

  const fetchMessage = async () => {
    const { data } = await Axios.get(
      "http://localhost:5000" + location.pathname
    );
    const message = data[0];
    setMessage(message);
  };

  useEffect(() => {
    fetchMessage();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Box
      minH="100vh"
      bg={useColorModeValue("gray.100", "gray.900")}
      display="flex"
    >
      <Box w={1000} p={10}>
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
          <FormControl isRequired>
            <FormLabel htmlFor="receiver">To:</FormLabel>
            <Input
              id="input"
              placeholder={message.receiver}
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

      <Box ml={{ base: 0, md: 60 }} p="4">
        {children}
      </Box>
    </Box>
  );
}
