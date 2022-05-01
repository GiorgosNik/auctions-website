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
const IMAGE =
  "https://images.unsplash.com/photo-1518051870910-a46e30d9db16?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1350&q=80";

export default function Browse() {
  return (
    <Box m={5}>
      <Container>
        <Row>
          <Col sm={4}>
            <Filters />
          </Col>
          <Col sm={4}>
            <ProductCard />
          </Col>
          <Col sm={4}>One of three columns</Col>
        </Row>
      </Container>
    </Box>
  );
}

function Filters() {
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);

  const fetchCategories = async () => {
    const { data } = await Axios.get("http://localhost:5000/category");
    const categories = data;
    setCategories(categories);
  };

  const fetchLocations = async () => {
    const { data } = await Axios.get("http://localhost:5000/auth/locations");
    const locations = data;
    console.log(locations);
    setLocations(locations);
  };

  useEffect(() => {
    fetchCategories();
    fetchLocations();
  }, []);

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
          Description
        </p>

        <Input placeholder="Search" w={240} />
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
            return <Checkbox key={index}>{category.name}</Checkbox>;
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
      <PriceSlider />
      <br></br>
      <br></br>

      <p
        style={{
          fontSize: "20px",
          fontWeight: "bold",
          marginBottom: "10px",
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
              <MenuItem key={index}>
                {location.address +
                  ", " +
                  location.city +
                  ", " +
                  location.country}
              </MenuItem>
            );
          })}
        </MenuList>
      </Menu>
    </Stack>
  );
}

function PriceSlider() {
  const [sliderValue, setSliderValue] = useState(100);
  return (
    <Slider
      w={200}
      aria-label="slider-ex-6"
      onChangeEnd={(val) => console.log(val)}
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
  );
}

function ProductCard() {
  return (
    <Center py={12}>
      <Box
        role={"group"}
        p={6}
        maxW={"330px"}
        w={"full"}
        bg={useColorModeValue("white", "gray.800")}
        boxShadow={"2xl"}
        rounded={"lg"}
        pos={"relative"}
        zIndex={1}
      >
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
            backgroundImage: `url(${IMAGE})`,
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
            src={IMAGE}
          />
        </Box>
        <Stack pt={10} align={"center"}>
          <Text color={"gray.500"} fontSize={"sm"} textTransform={"uppercase"}>
            Brand
          </Text>
          <Heading fontSize={"2xl"} fontFamily={"body"} fontWeight={500}>
            Nice Chair, pink
          </Heading>
          <Stack direction={"row"} align={"center"}>
            <Text fontWeight={800} fontSize={"xl"}>
              $57
            </Text>
            <Text textDecoration={"line-through"} color={"gray.600"}>
              $199
            </Text>
          </Stack>
        </Stack>
      </Box>
    </Center>
  );
}
