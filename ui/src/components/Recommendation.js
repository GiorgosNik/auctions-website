import React, { useState, useEffect } from "react";
import {
  Stack,
  Box,
  Text,
  SimpleGrid,
  LinkBox,
  LinkOverlay,
  Center,
  useColorModeValue,
  Heading,
  Image,
} from "@chakra-ui/react";
import jwt from "jwt-decode";
import Axios from "axios";

export default function Recommendation() {
  var [recommended, setRecommended] = useState([]);

  const fetchRecommendations = async () => {
    const params = new URLSearchParams([
      ["account_id", jwt(localStorage.getItem("user")).user_id],
    ]);

    const { data: hasBids } = await Axios.get(
      "https://localhost:5000/bid/my/" +
        jwt(localStorage.getItem("user")).user_id,
      {
        params,
      }
    );

    const { data: hasViewedAuctions } = await Axios.get(
      "https://localhost:5000/view/my/" +
        jwt(localStorage.getItem("user")).user_id,
      {
        params,
      }
    );

    if (hasBids.length !== 0) {
      const { data } = await Axios.get(
        "https://localhost:5000/recommendation/bid/" +
          jwt(localStorage.getItem("user")).user_id
      );
      var auction_details = [];
      for (let recommendation of data) {
        var res = await Axios.get(
          "https://localhost:5000/auction/" + recommendation.auction_id
        );
        auction_details.push(res.data[0]);
      }
      console.log("1.", auction_details);
    } else if (hasViewedAuctions.length !== 0) {
      const { data: data_view } = await Axios.get(
        "https://localhost:5000/recommendation/views/" +
          jwt(localStorage.getItem("user")).user_id
      );
      console.log("2.", data_view);
      auction_details = [];
      for (let recommendation of data_view) {
        res = await Axios.get(
          "https://localhost:5000/auction/" + recommendation.auction_id
        );
        auction_details.push(res.data[0]);
      }
    } else {
      const { data: auction_items } = await Axios.get(
        "https://localhost:5000/auction/"
      );
      console.log("3.", auction_items);
      auction_details = [];
      for (let recommendation of auction_items) {
        res = await Axios.get(
          "https://localhost:5000/auction/" + recommendation.auction_id
        );
        auction_details.push(res.data[0]);
      }
    }
    setRecommended(auction_details.slice(0, 5));
  };

  useEffect(() => {
    fetchRecommendations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box p={4}>
      <SimpleGrid padding={15} columns={{ base: 1, md: 5 }} spacing={2}>
        {recommended.map((item, index) => {
          var productName = item.item_name;
          var price = item.price_curr;
          var buyoutPrice = item.price_inst;
          var id = item.id;
          var image = item.image;
          return (
            <Stack>
              <ProductCard
                productName={productName}
                price={price}
                buyoutPrice={buyoutPrice}
                id={id}
                image={image}
              />
            </Stack>
          );
        })}
      </SimpleGrid>
    </Box>
  );
}

function ProductCard({ productName, price, buyoutPrice, id, image }) {
  const goToAuctionPage = (id) => {
    window.location.href = "/auction/" + id;
  };

  if (image === null) {
    image = "https://localhost:5000/images/37375020.jpg";
  }
  return (
    <LinkBox
      as="article"
      maxW="sm"
      p="5"
      borderWidth="0px"
      rounded="md"
      style={{ cursor: "pointer" }}
    >
      <Center py={12}>
        <Box
          role={"group"}
          style={{ zIndex: "0" }}
          p={6}
          maxW={"330px"}
          w={"full"}
          bg={useColorModeValue("white", "gray.800")}
          boxShadow={"2xl"}
          rounded={"lg"}
          pos={"relative"}
        >
          <LinkOverlay onClick={() => goToAuctionPage(id)}>
            <Box
              rounded={"lg"}
              mt={-12}
              pos={"relative"}
              height={"230px"}
              _after={{
                transition: "all .3s ease",
                content: '""',
                w: "full",
                h: "full",
                pos: "absolute",
                top: 5,
                left: 0,
                backgroundImage: `url(${image})`,
                filter: "blur(15px)",
                zIndex: -1,
              }}
              _groupHover={{
                _after: {
                  filter: "blur(20px)",
                },
              }}
            >
              <Image
                rounded={"lg"}
                height={180}
                width={200}
                objectFit={"cover"}
                src={image}
              />
            </Box>
            <Stack pt={10} align={"center"}>
              <Heading fontSize={"2xl"} fontFamily={"body"} fontWeight={500}>
                {productName}
              </Heading>
              <Stack direction={"row"} align={"center"}>
                <Text fontWeight={800} fontSize={"xl"}>
                  ${price}
                </Text>
                <Text color={"gray.600"}>{buyoutPrice}</Text>
              </Stack>
            </Stack>
          </LinkOverlay>
        </Box>
      </Center>
    </LinkBox>
  );
}
