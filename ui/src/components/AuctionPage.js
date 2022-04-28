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

export default function Simple() {
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
            src={
              "https://images.unsplash.com/photo-1596516109370-29001ec8ec36?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyODE1MDl8MHwxfGFsbHx8fHx8fHx8fDE2Mzg5MzY2MzE&ixlib=rb-1.2.1&q=80&w=1080"
            }
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
              Automatic Watch
            </Heading>
            <Stack>
              <Text
                color={useColorModeValue("gray.900", "gray.400")}
                fontWeight={400}
                fontSize={"2xl"}
              >
                Current Price: $350.00 USD
              </Text>
            </Stack>
            <Text
              color={useColorModeValue("gray.900", "gray.400")}
              fontWeight={200}
              fontSize={"lg"}
            >
              Buyout Price at: $400.00 USD
            </Text>
            <Text
              color={useColorModeValue("gray.900", "gray.400")}
              fontWeight={200}
              fontSize={"lg"}
            >
              Started at: $200.00 USD
            </Text>
          </Box>
          <FormControl id="bid_form">
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
                  >
                    Place Bid
                  </Button>
                </Stack>
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
              <Text fontSize={"lg"}>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad
                aliquid amet at delectus doloribus dolorum expedita hic, ipsum
                maxime modi nam officiis porro, quae, quisquam quos
                reprehenderit velit? Natus, totam.
              </Text>
              <Text
                color={useColorModeValue("purple.500")}
                fontSize={"xl"}
                fontWeight={"600"}
                textAlign={"left"}
              >
                Categories
              </Text>
              <Stack direction={["column", "row"]}>
                <Text fontSize={"lg"}>Category 1</Text>
                <Text fontSize={"lg"}>Category 2</Text>
                <Text fontSize={"lg"}>Category 3</Text>
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
                  <ListItem>Name</ListItem>
                  <ListItem>Review Score</ListItem>{" "}
                  <ListItem>Review Number</ListItem>
                </List>
                <List spacing={2}>
                  <ListItem>Country</ListItem>
                  <ListItem>City</ListItem>
                  <ListItem>Return Policy</ListItem>
                </List>
              </SimpleGrid>
            </Box>
          </Stack>
        </Stack>
      </SimpleGrid>
    </Container>
  );
}
