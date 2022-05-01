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
  HStack,
  Box,
  Button,
} from "@chakra-ui/react";
import exportFromJSON from "export-from-json";
import { CheckIcon, CloseIcon, ArrowForwardIcon } from "@chakra-ui/icons";

export default function UsersList() {
  const [users, setUsers] = useState([]);

  const goToUserPage = (id) => {
    window.location.href = "/users/" + id;
  };

  const fetchUsers = async () => {
    const { data } = await Axios.get("http://localhost:5000/auth/users");
    const users = data;
    setUsers(users);
  };

  useEffect(() => {
    fetchUsers();
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
              Users
            </TableCaption>
            <Thead>
              <Tr>
                <Th>#</Th>
                <Th>Username</Th>
                <Th>Approved</Th>
                <Th></Th>
              </Tr>
            </Thead>
            <Tbody>
              {users.map((user, index) => {
                const username = user.username;
                if (username !== "admin") {
                  return (
                    <Tr key={index}>
                      <Td>{index}</Td>
                      <Td>{user.username}</Td>
                      {user.approved && (
                        <Td>
                          <CheckIcon w={3} h={3} color={"green"} />
                        </Td>
                      )}
                      {!user.approved && (
                        <Td>
                          <CloseIcon w={3} h={3} color={"red"} />
                        </Td>
                      )}
                      <Td>
                        <Button
                          rightIcon={<ArrowForwardIcon />}
                          colorScheme="purple"
                          variant="outline"
                          onClick={() => goToUserPage(user.id)}
                        >
                          Details
                        </Button>
                      </Td>
                    </Tr>
                  );
                }
                return null;
              })}
            </Tbody>
          </Table>
        </TableContainer>
      </Box>
      <DownloadAuctions />
    </Stack>
  );
}

function DownloadAuctions() {
  const [auctions, setAuctions] = useState(null);

  const fetchAuctions = async () => {
    const { data } = await Axios.get("http://localhost:5000/auction");
    setAuctions(data);
  };

  const toXML = async () => {
    const data = auctions;
    const fileName = "auctions";
    const exportType = "xml";
    console.log(data);
    exportFromJSON({ data, fileName, exportType });
  };

  useEffect(() => {
    fetchAuctions();
  }, []);

  return (
    <HStack style={{ display: "flex" }}>
      <Stack style={{ marginLeft: "auto" }}></Stack>
      <HStack style={{ marginLeft: "auto" }}>
        <a
          href={`data:text/json;charset=utf-8,${encodeURIComponent(
            JSON.stringify({ auctions })
          )}`}
          download="auctions.json"
        >
          <Button
            style={{ marginLeft: "auto" }}
            mx={3}
            colorScheme={"purple"}
            bg={"purple.400"}
          >
            All auctions in JSON
          </Button>
        </a>
        <Button
          style={{ marginLeft: "auto" }}
          colorScheme={"purple"}
          bg={"purple.400"}
          onClick={toXML}
        >
          All auctions in XML
        </Button>
      </HStack>
    </HStack>
  );
}
