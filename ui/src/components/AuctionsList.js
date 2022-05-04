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
import { ArrowForwardIcon, CheckIcon, CloseIcon } from "@chakra-ui/icons";

export default function AuctionsList() {
  const [auctions, setAuctions] = useState([]);
  const accountId = jwt(localStorage.getItem("user")).user_id;
  const goToAuctionPage = (id) => {
    window.location.href = "/editauction/" + id;
  };

  const fetchAuctions = async () => {
    const { data } = await Axios.get(
      "https://localhost:5000/auction/myauctions/" + accountId
    );
    const auctions = data;
    setAuctions(auctions);
  };

  useEffect(() => {
    fetchAuctions();
  }, []);

  return (
    <Stack>
      <br></br>
      <Box p={50} align={"center"}>
        <TableContainer
          bg={"purple.100"}
          borderRadius={30}
          maxWidth={1000}
          border={"1px solid"}
        >
          <Table variant="simple">
            <TableCaption placement="top" fontSize={20}>
              My Auctions
            </TableCaption>
            <Thead>
              <Tr>
                <Th>Product Name</Th>
                <Th>Current Price</Th>
                <Th>Ends</Th>
                <Th>Bids</Th>
                <Th>Started</Th>
              </Tr>
            </Thead>
            <Tbody>
              {auctions.map((auction, index) => {
                return (
                  <Tr key={index}>
                    <Td>{auction.item_name}</Td>
                    <Td>{auction.price_curr}</Td>
                    <Td>{auction.ends}</Td>
                    <Td>{auction.num_of_bids}</Td>
                    {auction.started !== null && (
                      <Td>
                        <CheckIcon w={3} h={3} color={"green"} />
                      </Td>
                    )}
                    {auction.started === null && (
                      <Td>
                        <CloseIcon w={3} h={3} color={"red"} />
                      </Td>
                    )}
                    <Td>
                      <Button
                        rightIcon={<ArrowForwardIcon />}
                        colorScheme="purple"
                        variant="outline"
                        onClick={() => goToAuctionPage(auction.id)}
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
