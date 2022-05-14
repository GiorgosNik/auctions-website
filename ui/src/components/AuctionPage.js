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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import Axios from "axios";
import jwt from "jwt-decode";
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import OpenStreetMap from "./Map";
import { CCarousel, CCarouselItem, CImage } from "@coreui/react";
import "@coreui/coreui/dist/css/coreui.min.css";
import ReactStars from "react-rating-stars-component";

function BidConfirmation({ submitHandler }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Button
        style={{ height: "38px", width: "170px", fontSize: "20px" }}
        rounded={"md"}
        px={8}
        colorScheme={"purple"}
        bg={"purple.400"}
        _hover={{ bg: "purple.500" }}
        onClick={onOpen}
      >
        Place Bid
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirmation</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Are you sure you want to proceed? This action cannot be reversed!
          </ModalBody>

          <ModalFooter>
            <Button color="#9F7AEA" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={submitHandler} colorScheme="purple">
              Confirm Bid
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default function AuctionPage() {
  const [errorMessage, setErrorMessage] = useState("");
  const location = useLocation();
  const [amount, setBidAmount] = useState("");
  const [auction, setAuction] = useState([]);
  const [seller, setSeller] = useState([]);
  const [categories, setCategories] = useState([]);
  const [auction_id, setAuctionId] = useState("");
  const [review, setReview] = useState(0);
  const [flag, setFlag] = useState(false);

  var account_id = 0;
  if (localStorage.getItem("user")) {
    account_id = jwt(localStorage.getItem("user")).user_id;
  }
  const fetchAuction = async () => {
    const { data } = await Axios.get(
      "https://localhost:5000" + location.pathname
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
    try {
      fetch("https://localhost:5000/bid", {
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
        });
    } catch (err) {
      console.error(err.message);
    }
  };

  const viewCount = () => {
    if (!flag && auction_id !== "") {
      const body = {
        auction_id,
        account_id,
      };
      try {
        fetch("https://localhost:5000/view", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      } catch (err) {
        console.error(err.message);
      }
      setFlag(true);
    }
  };

  const fetchReview = async () => {
    const { data } = await Axios.get(
      "https://localhost:5000/auth/review/" + auction.user.id
    );
    const review = data;
    setReview(review[0].sellerscore / review[0].sellerreviewcount);
  };

  useEffect(() => {
    fetchAuction();
    fetchReview();
    viewCount();
  });

  const ratingChanged = (newRating) => {
    var seller_id = auction.user.id;
    var score = newRating;
    const body = {
      seller_id,
      score,
    };
    fetch("https://localhost:5000/auth/review", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  };

  return (
    <Container maxW={"7xl"}>
      <SimpleGrid
        columns={{ base: 1, lg: 2 }}
        spacing={{ base: 8, md: 10 }}
        py={{ base: 18, md: 24, lg: 30 }}
      >
        <Flex>
          {auction.image !== null && auction.image !== "" && (
            <Carousel images={auction?.image} />
          )}
          {(auction.image === null || auction.image === "") && (
            <Image
              rounded={"md"}
              alt={"product image"}
              src={"https://localhost:5000/images/37375020.jpg"}
              fit={"cover"}
              align={"center"}
              w={"100%"}
              h={{ base: "100%", sm: "400px", lg: "500px" }}
            />
          )}
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
                {"Current Price: $" + auction.price_curr}
              </Text>
            </Stack>
            <Text
              color={useColorModeValue("gray.900", "gray.400")}
              fontWeight={400}
              fontSize={"2xl"}
            >
              {"Auction: " + auction.auction_name}
            </Text>
            {auction.price_inst !== "" && auction.price_inst !== null && (
              <Text fontWeight={200} fontSize={"lg"}>
                {"Buyout Price: $" + auction.price_inst}
              </Text>
            )}

            <Text
              color={useColorModeValue("gray.900", "gray.400")}
              fontWeight={200}
              fontSize={"lg"}
            >
              {"Starting Price: $" + auction.price_start}
            </Text>
          </Box>
          {(auction.started !== null && (auction.price_curr < auction.price_inst || auction.price_inst === null) && auction.message_sent === false) && (
            <FormControl id="bid_form" isRequired>
              <Stack direction={["column", "row"]}>
                <Box>
                  <FormLabel color={"gray"} fontWeight={"600"}>
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
                        color={"gray"}
                        fontWeight={"500"}
                        placeholder="Your Bid"
                        _placeholder={{ color: "gray.500" }}
                      />
                      <InputRightAddon children="$" />
                    </InputGroup>
                    <BidConfirmation submitHandler={submitHandler} />
                  </Stack>
                  {errorMessage !== "" && (
                    <span
                      id="message"
                      style={{ color: "red", fontSize: "15px" }}
                    >
                      {errorMessage}
                    </span>
                  )}
                </Box>
              </Stack>
            </FormControl>
          )}
          {(auction.started === null || (auction.price_curr >= auction.price_inst && auction.price_inst !== null)) && (
            <Text
              color={"purple.500"}
              fontSize={"2xl"}
              fontWeight={"600"}
              textAlign={"left"}
            >
              Auction Not Active
            </Text>
          )}
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

              <ReactStars
                count={5}
                onChange={ratingChanged}
                size={24}
                activeColor="#ffd700"
              />

              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
                <List spacing={2}>
                  <ListItem>{seller.username}</ListItem>
                  {!isNaN(review) && (
                    <ListItem>Review Score : {review}</ListItem>
                  )}
                </List>
                <List spacing={2}>
                  <ListItem>
                    {seller.address +
                      ", " +
                      seller.city +
                      ", " +
                      seller.country}
                  </ListItem>
                </List>
              </SimpleGrid>
            </Box>
          </Stack>
        </Stack>
      </SimpleGrid>
      <OpenStreetMap address={seller.address} city={seller.city} />
    </Container>
  );
}

function Carousel(images) {
  const cards = [];
  if (images.images) {
    var imagesArray = images.images.split(",");
    for (let i = 0; i < imagesArray.length; i++) {
      cards.push({
        image: imagesArray[i],
      });
    }

    if (cards.length !== 0) {
      return (
        <CCarousel controls transition="crossfade">
          {cards.map((url, index) => (
            <CCarouselItem key={index}>
              <CImage className="d-block w-100" src={url.image} />
            </CCarouselItem>
          ))}
        </CCarousel>
      );
    }
  }
}
