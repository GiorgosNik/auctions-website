import {
  Box,
  Container,
  Stack,
  Text,
  Button,
  FormControl,
  FormLabel,
  Input,
  NumberInput,
  InputLeftElement,
  InputRightAddon,
  Select,
  InputGroup,
  Heading,
  SimpleGrid,
  StackDivider,
  useColorModeValue,
  Textarea,
} from "@chakra-ui/react";
import React, { useState } from "react";
import DatePicker from "react-date-picker";

export default function Simple() {
  const [val, setVal] = useState(0);
  const [value, onChange] = useState(new Date());
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

                  <FormControl id="product_name">
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
                    />
                  </FormControl>
                  <FormControl id="product_description">
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
                    />
                  </FormControl>
                  <Stack direction={["column", "row"]}>
                    <Select placeholder="Select Category">
                      <option value="option1">Option 1</option>
                      <option value="option2">Option 2</option>
                      <option value="option3">Option 3</option>
                    </Select>
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

                  <FormControl id="starting_price">
                    <Stack direction={["column", "row"]}>
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
                            />
                            <InputRightAddon children="$" />
                          </InputGroup>
                        </Stack>
                      </Box>
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
                            />
                            <InputRightAddon children="$" />
                          </InputGroup>
                        </Stack>
                      </Box>
                    </Stack>
                  </FormControl>
                  {/*<Box>
                  <DatePicker  onChange={onChange} value={value} />
                  </Box>*/}
                </Stack>
              </Stack>
            </Stack>

            <Button
              rounded={"none"}
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
            >
              Create Listing
            </Button>
          </Box>
        </SimpleGrid>
      </Stack>
    </Container>
  );
}
