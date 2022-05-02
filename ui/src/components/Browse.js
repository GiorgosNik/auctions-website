import {
  Stack,
  Checkbox,
  CheckboxGroup,
  Box,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  SimpleGrid,
  LinkBox,
  LinkOverlay,
  SliderMark,
  Input,
  Center,
  useColorModeValue,
  Heading,
  Image,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import React, { useState, useEffect } from "react";
import Axios from "axios";
import { Container, Row, Col } from "react-grid-system";
const goToAuctionPage = (id) => {
  window.location.href = "/auction/" + id;
};

const producsPerPage = 6;
export default function Browse() {
  const [searchTerms, setSearchTerms] = useState("");
  const [curPage, setCurPage] = useState(1);
  var [productArray, setProductArray] = useState([]);
  var pagesArray = [];

  const pageSelectHandler = (pageId) => {
    setCurPage(pageId);
  };
  
  const fetchProductArray = async () => {
    const { data } = await Axios.get("http://localhost:5000/auction/search", {
      params: { term: searchTerms },
    });
    setProductArray(data);
  };
  
  const setProductArrayFilter = (data) => {
    productArray = [];
    setProductArray(data);
    setCurPage(1);
  };

  for (let i = 0; i < productArray.length / producsPerPage; i++) {
    pagesArray.push(1);
  }

  useEffect(() => {
    fetchProductArray();
    setCurPage(1);
  }, [searchTerms]);


  return (
    <Box m={5}>
      <Input
        onChange={(event) => setSearchTerms(event.target.value)}
        placeholder="Search"
        w={240}
      />
      <Container>
        <Row>
          <Col sm={2.5}>
            <Filters setProducts={setProductArrayFilter}/>
            {pagesArray.map((page, index) => {
              return (
                <Button
                  key={index}
                  marginTop={40}
                  mx={1}
                  colorScheme="purple"
                  variant="outline"
                  onClick={() => pageSelectHandler(index + 1)}
                >
                  {index + 1}
                </Button>
              );
            })}
          </Col>
          <SimpleGrid columns={[1, 2, 3]} spacing={10}>
            {productArray.map((product, index) => {
              if (
                index > producsPerPage * curPage - producsPerPage - 1 &&
                index < producsPerPage * curPage
              )
                return (
                  <ProductCard
                    productName={product.item_name}
                    sellerUsername={product.username}
                    price={product.price_curr}
                    buyoutPrice={product.price_inst}
                    id={product.id}
                    image={product.image}
                    key={index}
                  />
                );
            })}
          </SimpleGrid>
        </Row>
      </Container>
    </Box>
  );
}

function Filters({setProducts}) {
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [sliderValue, setSliderValue] = useState(100);
  const [productCategories, setProductCategories] = useState([]);
  const [productLocation, setProductLocation] = useState("");
  const [productPrice, setProductPrice] = useState(100);

  const categoryChangeHandler = (categoryName, event) => {
    var tempList = [];
    tempList = productCategories;
    if (tempList.includes(categoryName)) {
      tempList.splice(tempList.indexOf(categoryName), 1);
    } else {
      tempList.push(categoryName);
    }
    setProductCategories(tempList);
    fetchProducts();
  };

  const fetchCategories = async () => {
    const { data } = await Axios.get("http://localhost:5000/category");
    const categories = data;
    setCategories(categories);
  };

  const fetchLocations = async () => {
    const { data } = await Axios.get("http://localhost:5000/auth/locations");
    const locations = data;
    setLocations(locations);
  };

  const fetchProducts = async () => {
    if (
      productCategories === [] &&
      productLocation === "" &&
      productPrice === 100
    ) {
      return;
    }
    const locationArray = productLocation.split(",");

    const params = new URLSearchParams([
      ["categories", productCategories.map((s) => [s])],
      ["address", locationArray[0]],
      ["city", locationArray[1]],
      ["country", locationArray[2]],
      ["price", productPrice],
    ]);
    const { data } = await Axios.get("http://localhost:5000/auction/browse", {
      params,
    });

    const products = data;
    setProducts(products);
  };

  useEffect(() => {
    fetchCategories();
    fetchLocations();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [productLocation]);

  useEffect(() => {
    fetchProducts();
  }, [productPrice]);

  return (
    <Stack>
      <CheckboxGroup colorScheme="purple">
        

        <p
          style={{
            fontSize: "20px",
            fontWeight: "bold",
            marginTop: "30px",
            marginBottom: "10px",
          }}
        >
          Category
        </p>
        <Stack>
          {categories.map((category, index) => {
            return (
              <Checkbox
                key={index}
                onChange={() => categoryChangeHandler(category.name)}
              >
                {category.name}
              </Checkbox>
            );
          })}
        </Stack>
        <p
          style={{
            fontSize: "20px",
            fontWeight: "bold",
            marginTop: "30px",
            marginBottom: "10px",
          }}
        >
          Price
        </p>
      </CheckboxGroup>
      <Slider
        w={200}
        aria-label="slider-ex-6"
        onChangeEnd={(val) => setProductPrice(val)}
        onChange={(val) => setSliderValue(val)}
      >
        <SliderMark value={100} mt="1" ml="-2.5" fontSize="sm">
          100
        </SliderMark>

        <SliderMark
          value={sliderValue}
          textAlign="center"
          bg="purple.500"
          color="white"
          mt="-10"
          ml="-5"
          w="12"
        >
          {sliderValue}
        </SliderMark>
        <SliderTrack>
          <SliderFilledTrack bg="purple.500" />
        </SliderTrack>
        <SliderThumb />
      </Slider>
      <br></br>
      <br></br>

      <p
        style={{
          fontSize: "20px",
          fontWeight: "bold",
        }}
      >
        Location
      </p>

      <Menu>
        <MenuButton width={200} as={Button} rightIcon={<ChevronDownIcon />}>
          Location
        </MenuButton>
        <MenuList>
          {locations.map((location, index) => {
            return (
              <MenuItem
                key={index}
                onClick={() =>
                  setProductLocation(
                    location.address +
                      "," +
                      location.city +
                      "," +
                      location.country
                  )
                }
              >
                {location.address +
                  "," +
                  location.city +
                  "," +
                  location.country}
              </MenuItem>
            );
          })}
        </MenuList>
      </Menu>
    </Stack>
  );
}

function ProductCard({
  productName,
  sellerUsername,
  price,
  buyoutPrice,
  id,
  image,
  index,
}) {
  return (
    <LinkBox as="article" maxW="sm" p="5" borderWidth="0px" rounded="md">
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
          zIndex={1}
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
                height={230}
                width={282}
                objectFit={"cover"}
                src={image}
              />
            </Box>
            <Stack pt={10} align={"center"}>
              <Text
                color={"gray.500"}
                fontSize={"sm"}
                textTransform={"uppercase"}
              >
                {sellerUsername + " " + id}
              </Text>
              <Heading fontSize={"2xl"} fontFamily={"body"} fontWeight={500}>
                {productName}
              </Heading>
              <Stack direction={"row"} align={"center"}>
                <Text fontWeight={800} fontSize={"xl"}>
                  {price}
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
