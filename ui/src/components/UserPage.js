import React, { useState, useEffect } from "react";
import Axios from "axios";

import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  useColorModeValue,
  HStack,
} from "@chakra-ui/react";
import { useLocation } from "react-router-dom";

export default function UserProfileEdit(): JSX.Element {
  const [user, setUser] = useState([]);
  const location = useLocation();

  const approveUser = async () => {
    await Axios.put("https://localhost:5000/auth" + location.pathname);
    window.location.href = location.pathname;
  };

  const disapproveUser = async () => {
    await Axios.delete("https://localhost:5000/auth" + location.pathname);
    window.location.href = "/users";
  };

  const fetchUser = async () => {
    const { data } = await Axios.get(
      "https://localhost:5000/auth" + location.pathname
    );
    const user = data[0];
    setUser(user);
  };

  useEffect(() => {
    fetchUser();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Flex
      minH={"100vh"}
      align={"center"}
      justify={"center"}
      bg={useColorModeValue("gray.50", "gray.800")}
    >
      <Stack
        spacing={4}
        w={"full"}
        maxW={"4xl"}
        bg={useColorModeValue("white", "gray.700")}
        rounded={"xl"}
        boxShadow={"lg"}
        p={6}
        my={12}
      >
        <Heading lineHeight={1.1} fontSize={{ base: "2xl", sm: "3xl" }}>
          {user.firstname} {user.lastname}
        </Heading>
        <HStack>
          <FormControl id="username">
            <FormLabel>Username</FormLabel>
            <Input
              id="input"
              type="text"
              placeholder={user.username}
              readOnly
            />
          </FormControl>
          <FormControl id="firstname">
            <FormLabel>Firstname</FormLabel>
            <Input
              id="input"
              type="firstname"
              placeholder={user.firstname}
              readOnly
            />
          </FormControl>
          <FormControl id="lastname">
            <FormLabel>Lastname</FormLabel>
            <Input
              id="input"
              type="lastname"
              placeholder={user.lastname}
              readOnly
            />
          </FormControl>
        </HStack>
        <HStack>
          <FormControl id="email">
            <FormLabel>Email address</FormLabel>
            <Input id="input" type="email" placeholder={user.email} readOnly />
          </FormControl>
          <FormControl id="phone">
            <FormLabel>Phone number</FormLabel>
            <Input id="input" type="phone" placeholder={user.phone} readOnly />
          </FormControl>
          <FormControl id="country">
            <FormLabel>Country</FormLabel>
            <Input
              id="input"
              type="country"
              placeholder={user.country}
              readOnly
            />
          </FormControl>
        </HStack>
        <HStack>
          <FormControl id="address">
            <FormLabel>Address</FormLabel>
            <Input
              id="input"
              type="address"
              placeholder={user.address + ", " + user.city}
              readOnly
            />
          </FormControl>
          <FormControl id="postcode">
            <FormLabel>Postcode</FormLabel>
            <Input
              id="input"
              type="postcode"
              placeholder={user.postcode}
              readOnly
            />
          </FormControl>
          <FormControl id="taxcode">
            <FormLabel>Tax Code</FormLabel>
            <Input
              id="input"
              type="taxcode"
              placeholder={user.taxcode}
              readOnly
            />
          </FormControl>
        </HStack>
        <Stack spacing={6} direction={["column", "row"]}>
          <Button
            onClick={disapproveUser}
            bg={"white.400"}
            color={"purple.400"}
            w="full"
            _hover={{
              bg: "white.500",
            }}
            border={"1px solid grey"}
          >
            Disapprove
          </Button>
          <Button
            onClick={approveUser}
            bg={"purple.400"}
            color={"white"}
            w="full"
            _hover={{
              bg: "purple.500",
            }}
          >
            Approve
          </Button>
        </Stack>
      </Stack>
    </Flex>
  );
}
