import {
  Box,
  Container,
  Stack,
  Text,
  Image,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  Flex,
  Button,
  Heading,
  SimpleGrid,
  StackDivider,
  InputLeftElement,
  InputRightAddon,
  useColorModeValue,
  List,
  ListItem,
} from "@chakra-ui/react";
import Axios from "axios";
import jwt from "jwt-decode";
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function AuctionPage() {
  const [errorMessage, setErrorMessage] = useState("");
  const location = useLocation();
  const [amount, setBidAmount] = useState("");
  const [auction, setAuction] = useState([]);
  const [seller, setSeller] = useState([]);
  const [categories, setCategories] = useState([]);
  const [auction_id, setAuctionId] = useState("");
  const account_id = jwt(localStorage.getItem("user")).user_id;
  const fetchAuction = async () => {
    const { data } = await Axios.get(
      "http://localhost:5000" + location.pathname
    );

    const auction = data;
    setAuction(auction[0]);
    setAuctionId(auction[0].id);
    setCategories(auction[0].categories);
    setSeller(auction[0].user);
  };
  const bidAmountChangeHandler = (event) => {
    setBidAmount(event.target.value);
  };

  const submitHandler = (event) => {
    event.preventDefault();

    const body = {
      amount,
      auction_id,
      account_id,
    };
    console.log(body);
    try {
      fetch("http://localhost:5000/bid", {
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
            window.location.href = "";
          }
          console.log(res);
        });
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    fetchAuction();
  });
  return (
    <Container maxW={"7xl"}>
      <SimpleGrid
        columns={{ base: 1, lg: 2 }}
        spacing={{ base: 8, md: 10 }}
        py={{ base: 18, md: 24, lg: 30 }}
      >
        <Flex>
          <Image
            rounded={"md"}
            alt={"product image"}
            src={auction.image}
            fit={"cover"}
            align={"center"}
            w={"100%"}
            h={{ base: "100%", sm: "400px", lg: "500px" }}
          />
        </Flex>
        <Stack>
          <Box as={"header"}>
            <Heading
              lineHeight={1.1}
              fontWeight={600}
              fontSize={{ base: "2xl", sm: "4xl", lg: "5xl" }}
            >
              {auction.item_name}
            </Heading>
            <Stack>
              <Text
                color={useColorModeValue("gray.900", "gray.400")}
                fontWeight={400}
                fontSize={"2xl"}
              >
                {"Current Price: " + auction.price_curr}
              </Text>
            </Stack>
            {auction.price_inst !== "" && (
              <Text fontWeight={200} fontSize={"lg"}>
                {"Buyout Price " + auction.price_inst}
              </Text>
            )}

            <Text
              color={useColorModeValue("gray.900", "gray.400")}
              fontWeight={200}
              fontSize={"lg"}
            >
              {"Starting Price " + auction.price_start}
            </Text>
          </Box>
          <FormControl id="bid_form" isRequired>
            <Stack direction={["column", "row"]}>
              <Box>
                <FormLabel
                  color={useColorModeValue("gray.600", "gray.500")}
                  fontWeight={"600"}
                >
                  Make a bid
                </FormLabel>
                <Stack direction={["column", "row"]}>
                  <InputGroup>
                    <InputLeftElement
                      pointerEvents="none"
                      color="gray.300"
                      fontSize="1.2em"
                      children="$"
                    />
                    <Input
                      htmlSize={17}
                      width="auto"
                      type="text"
                      onChange={bidAmountChangeHandler}
                      onKeyPress={(event) => {
                        if (!/[0-9]/.test(event.key)) {
                          event.preventDefault();
                        }
                      }}
                      color={useColorModeValue("gray.600", "gray.500")}
                      fontWeight={"500"}
                      placeholder="Your Bid"
                      _placeholder={{ color: "gray.500" }}
                    />
                    <InputRightAddon children="$" />
                  </InputGroup>
                  <Button
                    style={{ height: "38px", width: "170px", fontSize: "20px" }}
                    rounded={"md"}
                    px={8}
                    colorScheme={"purple"}
                    bg={"purple.400"}
                    _hover={{ bg: "purple.500" }}
                    onClick={submitHandler}
                  >
                    Place Bid
                  </Button>
                </Stack>
                {errorMessage !== "" && (
                  <span id="message" style={{ color: "red", fontSize: "15px" }}>
                    {errorMessage}
                  </span>
                )}
              </Box>
            </Stack>
          </FormControl>
          <Stack
            spacing={{ base: 4, sm: 6 }}
            direction={"column"}
            divider={
              <StackDivider
                borderColor={useColorModeValue("gray.200", "gray.600")}
              />
            }
          >
            <Stack spacing={{ base: 2, sm: 3 }}>
              <Text
                color={useColorModeValue("purple.500")}
                fontSize={"2xl"}
                fontWeight={"600"}
                textAlign={"left"}
              >
                Item Description
              </Text>
              <Text fontSize={"lg"}>{auction.description}</Text>
              <Text
                color={useColorModeValue("purple.500")}
                fontSize={"xl"}
                fontWeight={"600"}
                textAlign={"left"}
              >
                Categories
              </Text>
              <Stack direction={["column", "row"]}>
                {categories.map((category, index) => {
                  return (
                    <Text key={index} fontSize={"lg"}>
                      {category}
                    </Text>
                  );
                })}
              </Stack>
            </Stack>
            <Box>
              <Text
                fontSize={{ base: "16px", lg: "18px" }}
                color={useColorModeValue("purple.500")}
                fontWeight={"600"}
                textTransform={"uppercase"}
                mb={"4"}
              >
                Seller Details
              </Text>

              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
                <List spacing={2}>
                  <ListItem>{seller.username}</ListItem>
                  <ListItem>Review Score</ListItem>{" "}
                </List>
                <List spacing={2}>
                  <ListItem>{seller.country}</ListItem>
                  <ListItem>{seller.city}</ListItem>
                </List>
              </SimpleGrid>
            </Box>
          </Stack>
        </Stack>
      </SimpleGrid>
    </Container>
  );
}
