import {
  Box,
  Button,
  Stack,
  useColorModeValue,
  FormControl,
  FormLabel,
  Input,
  Heading,
  CloseButton,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";

import { useState, useCallback } from "react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";

export default function LoginCard({ onLoginChange }) {
  const closeModal = useCallback(
    (event) => {
      onLoginChange(event.target.value);
    },
    [onLoginChange]
  );
  const [loggedIn, setLoggedIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const usernameChangeHandler = (event) => {
    setUsername(event.target.value);
  };
  const passwordChangeHandler = (event) => {
    setPassword(event.target.value);
  };

  const submitHandler = (event) => {
    event.preventDefault();

    const body = {
      username,
      password,
    };

    try {
      fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
        .then((res) => res.json())
        .then(async (res) => {
          if (res?.error) {
            setSuccessMessage("");
            setErrorMessage(res?.error);
          } else {
            setErrorMessage("");
            setSuccessMessage("Thank you!");
            console.log(res);
            if (res.approved !== true) {
              window.location.href = "/waitingroom";
            } else {
              setLoggedIn(true);
              window.location.reload();
            }
          }
          console.log(errorMessage);
        });
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <Stack mx={"auto"} maxW={"lg"} px={6}>
      <Box
        style={{ zIndex: "1" }}
        position={"absolute"}
        rounded={"lg"}
        bg={useColorModeValue("white", "gray.700")}
        boxShadow={"lg"}
        p={70}
      >
        <CloseButton style={{ float: "right" }} onClick={closeModal} />
        <Stack align={"center"}>
          <Heading fontSize={"4xl"} paddingBottom={7}>
            Sign in
          </Heading>
        </Stack>
        <Stack spacing={4}>
          <FormControl id="username" isRequired>
            <FormLabel>Username</FormLabel>
            <Input
              type="username"
              value={username}
              onChange={usernameChangeHandler}
            />
          </FormControl>
          <FormControl id="password" isRequired>
            <FormLabel>Password</FormLabel>
            <InputGroup>
              <Input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={passwordChangeHandler}
              />
              <InputRightElement h={"full"}>
                <Button
                  variant={"ghost"}
                  onClick={() =>
                    setShowPassword((showPassword) => !showPassword)
                  }
                >
                  {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                </Button>
              </InputRightElement>
            </InputGroup>
          </FormControl>

          <Stack spacing={10}>
            <Stack
              direction={{ base: "column", sm: "row" }}
              align={"start"}
              justify={"space-between"}
            ></Stack>
            {errorMessage !== "" && (
              <span id="message" style={{ color: "red", fontSize: "15px" }}>
                {errorMessage}
              </span>
            )}
            {successMessage !== "" && (
              <span id="message" style={{ color: "green", fontSize: "15px" }}>
                {successMessage}
              </span>
            )}
            <Button
              onClick={submitHandler}
              bg={"purple.400"}
              color={"white"}
              _hover={{
                bg: "purple.500",
              }}
            >
              Sign in
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Stack>
  );
}
