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

import { ArrowForwardIcon } from "@chakra-ui/icons";

export default function AuctionsList() {
  const [auctions, setAuctions] = useState([]);

  const goToAuctionPage = (id) => {
    window.location.href = "/auctions/" + id;
  };

  const fetchAuctions = async () => {
    const { data } = await Axios.get("http://localhost:5000/auctions");
    const auctions = data;
    setAuctions(auctions);
    console.log(auctions);
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
          maxWidth={800}
          border={"1px solid"}
        >
          <Table variant="simple">
            <TableCaption placement="top" fontSize={20}>
              My Auctions
            </TableCaption>
            <Thead>
              <Tr>
                <Th></Th>
                <Th></Th>
                <Th></Th>
                <Th></Th>
              </Tr>
            </Thead>
            <Tbody>
              {auctions.map((auction, index) => {
                console.log(auction);
                return (
                  <Tr>
                    <Td>{index}</Td>
                    <Td></Td>
                    <Td></Td>
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
