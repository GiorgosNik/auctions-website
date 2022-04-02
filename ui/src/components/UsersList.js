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
} from "@chakra-ui/react";

export default function UsersList() {
  const [users, setUsers] = useState([]);

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
      <TableContainer>
        <Table variant="simple" colorScheme="purple">
          <TableCaption placement="top" fontSize={20}>
            Users
          </TableCaption>
          <Thead>
            <Tr>
              <Th>Index</Th>
              <Th>Username</Th>
              <Th>Approved</Th>
            </Tr>
          </Thead>
          <Tbody>
            {users.map((user, index) => {
              console.log(user);

              return (
                <Tr>
                  <Td>{index}</Td>
                  <Td>{user.username}</Td>
                  <Td>{user.approved}</Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </TableContainer>
    </Stack>
  );
}
