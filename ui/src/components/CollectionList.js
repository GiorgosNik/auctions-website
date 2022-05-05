import React, { useState, useEffect } from "react";
import Axios from "axios";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Stack,
  Box,
  Button,
} from "@chakra-ui/react";
import jwt from "jwt-decode";
import { ArrowForwardIcon } from "@chakra-ui/icons";

export default function CollectionList() {
  const [collections, setCollections] = useState([]);
  const accountId = jwt(localStorage.getItem("user")).user_id;
  const goToAuctionPage = (name) => {
    window.location.href = "/myauction/" + name;
  };

  const fetchCollections = async () => {
    const { data } = await Axios.get(
      "https://localhost:5000/auction/mycollections/" + accountId
    );
    setCollections(data);
  };

  const data = new FormData();

  useEffect(() => {
    fetchCollections();
  }, []);
  console.log(collections);
  return (
    <Stack>
      <br></br>
      <Box p={50} align={"center"}>
        <TableContainer
          bg={"purple.100"}
          borderRadius={30}
          maxWidth={650}
          border={"1px solid"}
        >
          <Table variant="simple">
            <TableCaption placement="top" fontSize={20}>
              My Auctions
            </TableCaption>
            <Thead>
              <Tr>
                <Th>Auction Name</Th>
                <Th></Th>
              </Tr>
            </Thead>
            <Tbody>
              {collections.map((collection, index) => {
                return (
                  <Tr key={index}>
                    <Td>{collection.auction_name}</Td>
                    <Td>
                      <Button
                        rightIcon={<ArrowForwardIcon />}
                        colorScheme="purple"
                        variant="outline"
                        onClick={() => goToAuctionPage(collection.id)}
                      >
                        Details
                      </Button>
                    </Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </TableContainer>
      </Box>
    </Stack>
  );
}
