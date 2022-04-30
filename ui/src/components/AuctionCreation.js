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
  useColorModeValue,
  Checkbox,
  Textarea,
  Icon,
} from "@chakra-ui/react";

import FileUpload from "./FileUpload";
import React, { useState, useEffect } from "react";
import Axios from "axios";
import jwt from "jwt-decode";

export default function AuctionMain() {
  const [errorMessage, setErrorMessage] = useState("");
  const [categories, setCategories] = useState([]);
  const [productCategories, setProductCategories] = useState([]);
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [startingPrice, setStartingPrice] = useState("");
  const [buyOutPrice, setBuyoutPrice] = useState("");
  const accountId = jwt(localStorage.getItem("user")).user_id;
  const [selectedFile, setSelectedFile] = useState(null);
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

  

  const submitHandler = (event) => {
    event.preventDefault();
    console.log(selectedFile);
    const body = {
      productName,
      productDescription,
      startingPrice,
      buyOutPrice,
      productCategories,
      accountId,
    };
    console.log(body);
    try {
      fetch("http://localhost:5000/auction", {
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
            window.location.href = "/myauctions/"+accountId;
          }
          console.log(res);
        });
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <Container maxW={"7xl"}>
      <Stack>
        <Box as={"header"} py={{ base: 5, md: 18 }}>
          <Heading
            lineHeight={1.1}
            fontWeight={600}
            fontSize={{ base: "2xl", sm: "4xl", lg: "5xl" }}
          >
            Create a listing
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
                divider={
                  <StackDivider
                    borderColor={useColorModeValue("gray.200", "gray.600")}
                  />
                }
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
                  <Text
                    color={useColorModeValue("gray.600", "gray.500")}
                    fontSize={"1xl"}
                    fontWeight={"520"}
                  >
                    First of all, we need some information on the item you want
                    to sell, like a title, a description and a general category.
                  </Text>

                  <FormControl id="product_name" isRequired>
                    <FormLabel
                      color={useColorModeValue("gray.600", "gray.500")}
                      fontWeight={"600"}
                    >
                      Product Name
                    </FormLabel>
                    <Input
                      type="text"
                      color={useColorModeValue("gray.600", "gray.500")}
                      fontWeight={"500"}
                      placeholder="A descriptive title for your product"
                      _placeholder={{ color: "gray.500" }}
                      onChange={productNameChangeHandler}
                    />
                  </FormControl>
                  <FormControl id="product_description" isRequired>
                    <FormLabel
                      color={useColorModeValue("gray.600", "gray.500")}
                      fontWeight={"600"}
                    >
                      Product Description
                    </FormLabel>
                    <Textarea
                      name="message"
                      placeholder="Give the buyer a good description of your product and it's features."
                      _placeholder={{ color: "gray.500" }}
                      rows={5}
                      resize="none"
                      onChange={productDescriptionChangeHandler}
                    />
                  </FormControl>
                  <Stack>
                    {categories.map((category, index) => {
                      return (
                        <Checkbox
                          colorScheme="purple"
                          key={index}
                          onChange={() => categoryChangeHandler(category.name)}
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
                divider={
                  <StackDivider
                    borderColor={useColorModeValue("gray.200", "gray.600")}
                  />
                }
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
                  <Text
                    color={useColorModeValue("gray.600", "gray.500")}
                    fontSize={"1xl"}
                    fontWeight={"520"}
                  >
                    Then we need some information on the way you want put your
                    item up for sale, like starting price, the amount of time
                    the auction should run for or if you want an instant-buy
                    price.
                  </Text>

                  <Stack direction={["column", "row"]}>
                    <FormControl id="starting_price" isRequired>
                      <Box>
                        <Stack direction={["column"]}>
                          <FormLabel
                            color={useColorModeValue("gray.600", "gray.500")}
                            fontWeight={"600"}
                          >
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
                              color={useColorModeValue("gray.600", "gray.500")}
                              fontWeight={"500"}
                              placeholder="The starting price"
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
                          <FormLabel
                            color={useColorModeValue("gray.600", "gray.500")}
                            fontWeight={"600"}
                          >
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
                              color={useColorModeValue("gray.600", "gray.500")}
                              fontWeight={"500"}
                              placeholder="The price to buy instantly"
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
                        <FormLabel
                          color={useColorModeValue("gray.600", "gray.500")}
                          fontWeight={"600"}
                        >
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
            <Button
              w={"full"}
              mt={8}
              size={"lg"}
              py={"7"}
              bg={"purple.600"}
              color={useColorModeValue("white", "gray.900")}
              textTransform={"uppercase"}
              _hover={{
                bg: "purple.400",
                boxShadow: "lg",
              }}
              borderRadius={10}
              onClick={submitHandler}
            >
              Create Listing
            </Button>
          </Box>
        </SimpleGrid>
      </Stack>
    </Container>
  );
}
