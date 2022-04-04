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

import { CheckIcon, CloseIcon, ArrowForwardIcon } from "@chakra-ui/icons";

export default function UsersList() {
  const [users, setUsers] = useState([]);

  const goToUserPage = (id) => {
    window.location.href = "/users/" + id;
  };

  const fetchUsers = async () => {
    const { data } = await Axios.get("http://localhost:5000/users");
    const users = data;
    setUsers(users);
    console.log(users);
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
                console.log(user);
                const username = user.username;
                console.log(username);
                if (username !== "admin") {
                  return (
                    <Tr>
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
    </Stack>
  );
}
