import {
  Box,
  Container,
  Stack,
  Text,
  Button,
  FormControl,
  FormLabel,
  Input,
  InputLeftElement,
  InputRightAddon,
  InputGroup,
  Heading,
  SimpleGrid,
  StackDivider,
  Checkbox,
  Textarea,
} from "@chakra-ui/react";

import React, { useState, useEffect } from "react";
import Axios from "axios";
import jwt from "jwt-decode";
import { useLocation } from "react-router-dom";

export default function AuctionMain() {
  const location = useLocation();
  const [errorMessage, setErrorMessage] = useState("");
  const [categories, setCategories] = useState([]);
  const [auctionCategories, setAuctionCategories] = useState([]);
  const [productCategories, setProductCategories] = useState([]);
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [startingPrice, setStartingPrice] = useState("");
  const [buyOutPrice, setBuyoutPrice] = useState("");
  const [auction, setAuction] = useState([]);
  const [auction_id, setAuctionId] = useState("");
  const accountId = jwt(localStorage.getItem("user")).user_id;
  const [selectedFile, setSelectedFile] = useState(null);
  const splitLocation = location.pathname.split("/");
  const fetchAuction = async () => {
    const { data } = await Axios.get(
      "http://localhost:5000/auction/" + splitLocation[2]
    );

    const auction = data;
    setAuction(auction[0]);
    setAuctionId(auction[0].id);
    setAuctionCategories(auction[0].categories);
    setProductCategories(auction[0].categories);
    setProductName(auction[0].item_name);
    setStartingPrice(auction[0].price_start);
    setBuyoutPrice(auction[0].price_inst);
    setProductDescription(auction[0].description);
  };
  const productNameChangeHandler = (event) => {
    setProductName(event.target.value);
  };
  const productDescriptionChangeHandler = (event) => {
    setProductDescription(event.target.value);
  };
  const startingPriceChangeHandler = (event) => {
    setStartingPrice(event.target.value);
  };
  const buyoutPriceChangeHandler = (event) => {
    setBuyoutPrice(event.target.value);
  };
  const categoryChangeHandler = (categoryName, event) => {
    var tempList = [];
    tempList = productCategories;
    if (tempList.includes(categoryName)) {
      tempList.splice(tempList.indexOf(categoryName), 1);
    } else {
      tempList.push(categoryName);
    }
    setProductCategories(tempList);
  };

  const fetchCategories = async () => {
    const { data } = await Axios.get("http://localhost:5000/category");
    const categories = data;
    setCategories(categories);
  };

  const deleteHandler = async () => {
    await Axios.delete("http://localhost:5000/auction/" + auction_id);
    window.location.href = "/myauctions/" + accountId;
  };

  const submitHandler = (event) => {
    var activate = false;
    event.preventDefault();
    const body = {
      productName,
      productDescription,
      startingPrice,
      buyOutPrice,
      productCategories,
      accountId,
      activate,
    };
    console.log(body);
    try {
      fetch("http://localhost:5000/auction/" + auction_id, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
        .then((res) => res.json())
        .then(async (res) => {
          if (res?.error) {
            setErrorMessage(res?.error);
          } else {
            setErrorMessage("");
            window.location.href = "/myauctions/" + accountId;
          }
        });
    } catch (err) {
      console.error(err.message);
    }
  };

  const activatetHandler = (event) => {
    var activate = true;
    event.preventDefault();
    const body = {
      productName,
      productDescription,
      startingPrice,
      buyOutPrice,
      productCategories,
      accountId,
      activate,
    };
    console.log(body);
    try {
      fetch("http://localhost:5000/auction/" + auction_id, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
        .then((res) => res.json())
        .then(async (res) => {
          if (res?.error) {
            setErrorMessage(res?.error);
          } else {
            setErrorMessage("");
            window.location.href = "/myauctions/" + accountId;
          }
        });
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchAuction();
  }, []);

  return (
    <Container maxW={"7xl"}>
      {auction.started === null && (
        <Stack>
          <Box as={"header"} py={{ base: 5, md: 18 }}>
            <Heading
              lineHeight={1.1}
              fontWeight={600}
              fontSize={{ base: "2xl", sm: "4xl", lg: "5xl" }}
            >
              Edit Listing
            </Heading>
          </Box>
          <SimpleGrid
            style={{ zIndex: "0" }}
            columns={{ base: 1, lg: 2 }}
            spacing={{ base: 8, md: 10 }}
            py={{ base: 5, md: 18 }}
          >
            <Box>
              <Stack spacing={{ base: 6, md: 6 }}>
                <Stack
                  spacing={{ base: 4, sm: 6 }}
                  direction={"column"}
                  divider={<StackDivider borderColor={"gray"} />}
                >
                  <Stack spacing={{ base: 2, md: 2 }}>
                    <Text
                      fontSize={{ base: "16px", lg: "18px" }}
                      color={"purple.500"}
                      fontWeight={"600"}
                      textTransform={"uppercase"}
                    >
                      Product Details
                    </Text>

                    <FormControl id="product_name" isRequired>
                      <FormLabel color={"gray"} fontWeight={"600"}>
                        Product Name
                      </FormLabel>
                      <Input
                        type="text"
                        color={"black"}
                        fontWeight={"500"}
                        defaultValue={auction.item_name}
                        _placeholder={{ color: "gray.500" }}
                        onChange={productNameChangeHandler}
                      />
                    </FormControl>
                    <FormControl id="product_description" isRequired>
                      <FormLabel color={"gray"} fontWeight={"600"}>
                        Product Description
                      </FormLabel>
                      <Textarea
                        name="message"
                        defaultValue={auction.description}
                        _placeholder={{ color: "gray.500" }}
                        rows={5}
                        resize="none"
                        onChange={productDescriptionChangeHandler}
                      />
                    </FormControl>
                    <Stack>
                      {categories.map((category, index) => {
                        return auctionCategories.includes(category.name) ? (
                          <Checkbox
                            defaultChecked
                            colorScheme="purple"
                            key={index}
                            onChange={() =>
                              categoryChangeHandler(category.name)
                            }
                          >
                            {category.name}
                          </Checkbox>
                        ) : (
                          <Checkbox
                            colorScheme="purple"
                            key={index}
                            onChange={() =>
                              categoryChangeHandler(category.name)
                            }
                          >
                            {category.name}
                          </Checkbox>
                        );
                      })}
                    </Stack>
                  </Stack>
                </Stack>
              </Stack>
            </Box>
            <Box>
              <Stack spacing={{ base: 6, md: 6 }}>
                <Stack
                  spacing={{ base: 4, sm: 6 }}
                  direction={"column"}
                  divider={<StackDivider borderColor={"gray"} />}
                >
                  <Stack spacing={{ base: 2, md: 2 }}>
                    <Text
                      fontSize={{ base: "16px", lg: "18px" }}
                      color={"purple.500"}
                      fontWeight={"600"}
                      textTransform={"uppercase"}
                    >
                      Auction Details
                    </Text>

                    <Stack direction={["column", "row"]}>
                      <FormControl id="starting_price" isRequired>
                        <Box>
                          <Stack direction={["column"]}>
                            <FormLabel color={"gray"} fontWeight={"600"}>
                              Starting Price
                            </FormLabel>
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
                                onKeyPress={(event) => {
                                  if (!/[0-9]/.test(event.key)) {
                                    event.preventDefault();
                                  }
                                }}
                                color={"black"}
                                fontWeight={"500"}
                                defaultValue={auction.price_start}
                                _placeholder={{ color: "gray.500" }}
                                onChange={startingPriceChangeHandler}
                              />
                              <InputRightAddon children="$" />
                            </InputGroup>
                          </Stack>
                        </Box>
                      </FormControl>
                      <FormControl id="buyOutPrice">
                        <Box>
                          <Stack direction={["column"]}>
                            <FormLabel color={"gray"} fontWeight={"600"}>
                              Buyout Price
                            </FormLabel>
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
                                onKeyPress={(event) => {
                                  if (!/[0-9]/.test(event.key)) {
                                    event.preventDefault();
                                  }
                                }}
                                color={"black"}
                                fontWeight={"500"}
                                defaultValue={auction.price_inst}
                                _placeholder={{ color: "gray.500" }}
                                onChange={buyoutPriceChangeHandler}
                              />
                              <InputRightAddon children="$" />
                            </InputGroup>
                          </Stack>
                        </Box>
                      </FormControl>
                    </Stack>
                    <FormControl id="imageUploader">
                      <Box>
                        <Stack direction={["column"]}>
                          <FormLabel color={"gray"} fontWeight={"600"}>
                            Upload Image
                          </FormLabel>
                          <Input
                            type="file"
                            onChange={(e) => setSelectedFile(e.target.files[0])}
                          />
                        </Stack>
                      </Box>
                    </FormControl>
                  </Stack>
                </Stack>
              </Stack>
              {errorMessage !== "" && (
                <span id="message" style={{ color: "red", fontSize: "15px" }}>
                  {errorMessage}
                </span>
              )}
              {auction.started === null && (
                <Button
                  w={"full"}
                  mt={8}
                  size={"lg"}
                  py={"7"}
                  color={"white"}
                  bg={"purple.600"}
                  textTransform={"uppercase"}
                  _hover={{
                    bg: "purple.400",
                    boxShadow: "lg",
                  }}
                  borderRadius={10}
                  onClick={submitHandler}
                >
                  Update Auction
                </Button>
              )}
              {auction.started === null && (
                <Button
                  w={"full"}
                  mt={8}
                  size={"lg"}
                  py={"7"}
                  bg={"purple.600"}
                  color={"white"}
                  textTransform={"uppercase"}
                  _hover={{
                    bg: "purple.400",
                    boxShadow: "lg",
                  }}
                  borderRadius={10}
                  onClick={deleteHandler}
                >
                  Delete Auction
                </Button>
              )}
              {auction.started === null && (
                <Button
                  w={"full"}
                  mt={8}
                  size={"lg"}
                  py={"7"}
                  bg={"purple.600"}
                  color={"white"}
                  textTransform={"uppercase"}
                  _hover={{
                    bg: "purple.400",
                    boxShadow: "lg",
                  }}
                  borderRadius={10}
                  onClick={activatetHandler}
                >
                  Start Auction
                </Button>
              )}
            </Box>
          </SimpleGrid>
        </Stack>
      )}
      {auction.started !== null && (
        <Stack>
          <Box as={"header"} py={{ base: 5, md: 18 }}>
            <Heading
              lineHeight={1.1}
              fontWeight={600}
              fontSize={{ base: "2xl", sm: "4xl", lg: "5xl" }}
            >
              Edit Listing
            </Heading>
          </Box>
          <SimpleGrid
            style={{ zIndex: "0" }}
            columns={{ base: 1, lg: 2 }}
            spacing={{ base: 8, md: 10 }}
            py={{ base: 5, md: 18 }}
          >
            <Box>
              <Stack spacing={{ base: 6, md: 6 }}>
                <Stack
                  spacing={{ base: 4, sm: 6 }}
                  direction={"column"}
                  divider={<StackDivider borderColor={"gray"} />}
                >
                  <Stack spacing={{ base: 2, md: 2 }}>
                    <Text
                      fontSize={{ base: "16px", lg: "18px" }}
                      color={"purple.500"}
                      fontWeight={"600"}
                      textTransform={"uppercase"}
                    >
                      Product Details
                    </Text>

                    <FormControl id="product_name" isRequired>
                      <FormLabel color={"gray"} fontWeight={"600"}>
                        Product Name
                      </FormLabel>
                      <Input
                        type="text"
                        color={"black"}
                        fontWeight={"500"}
                        value={auction.item_name}
                        isReadOnly
                      />
                    </FormControl>
                    <FormControl id="product_description" isRequired>
                      <FormLabel color={"gray"} fontWeight={"600"}>
                        Product Description
                      </FormLabel>
                      <Textarea
                        name="message"
                        value={auction.description}
                        isReadOnly
                        _placeholder={{ color: "gray.500" }}
                        rows={5}
                        resize="none"
                      />
                    </FormControl>
                    <Stack>
                      {categories.map((category, index) => {
                        return auctionCategories.includes(category.name) ? (
                          <Checkbox
                            defaultChecked
                            isReadOnly
                            colorScheme="purple"
                            key={index}
                          >
                            {category.name}
                          </Checkbox>
                        ) : (
                          <Checkbox colorScheme="purple" key={index} isReadOnly>
                            {category.name}
                          </Checkbox>
                        );
                      })}
                    </Stack>
                  </Stack>
                </Stack>
              </Stack>
            </Box>
            <Box>
              <Stack spacing={{ base: 6, md: 6 }}>
                <Stack
                  spacing={{ base: 4, sm: 6 }}
                  direction={"column"}
                  divider={<StackDivider borderColor={"gray"} />}
                >
                  <Stack spacing={{ base: 2, md: 2 }}>
                    <Text
                      fontSize={{ base: "16px", lg: "18px" }}
                      color={"purple.500"}
                      fontWeight={"600"}
                      textTransform={"uppercase"}
                    >
                      Auction Details
                    </Text>

                    <Stack direction={["column", "row"]}>
                      <FormControl id="starting_price" isRequired>
                        <Box>
                          <Stack direction={["column"]}>
                            <FormLabel color={"gray"} fontWeight={"600"}>
                              Starting Price
                            </FormLabel>
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
                                isReadOnly
                                type="text"
                                onKeyPress={(event) => {
                                  if (!/[0-9]/.test(event.key)) {
                                    event.preventDefault();
                                  }
                                }}
                                color={"black"}
                                fontWeight={"500"}
                                defaultValue={auction.price_start}
                                _placeholder={{ color: "gray.500" }}
                              />
                              <InputRightAddon children="$" />
                            </InputGroup>
                          </Stack>
                        </Box>
                      </FormControl>
                      <FormControl id="buyOutPrice">
                        <Box>
                          <Stack direction={["column"]}>
                            <FormLabel color={"gray"} fontWeight={"600"}>
                              Buyout Price
                            </FormLabel>
                            <InputGroup>
                              <InputLeftElement
                                pointerEvents="none"
                                color="gray.300"
                                fontSize="1.2em"
                                children="$"
                              />
                              <Input
                                htmlSize={17}
                                isReadOnly
                                width="auto"
                                type="text"
                                onKeyPress={(event) => {
                                  if (!/[0-9]/.test(event.key)) {
                                    event.preventDefault();
                                  }
                                }}
                                color={"black"}
                                fontWeight={"500"}
                                defaultValue={auction.price_inst}
                                _placeholder={{ color: "gray.500" }}
                              />
                              <InputRightAddon children="$" />
                            </InputGroup>
                          </Stack>
                        </Box>
                      </FormControl>
                    </Stack>
                  </Stack>
                </Stack>
              </Stack>
            </Box>
          </SimpleGrid>
        </Stack>
      )}
    </Container>
  );
}
