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
import jwt from "jwt-decode";

function transposeMatrix(matrix) {
  let trans = [];
  for (let i = 0; i < matrix[0].length; i++) {
    let temp = [];
    for (let j = 0; j < matrix.length; j++) {
      temp.push(matrix[j][i]);
    }
    trans.push(temp);
  }
  return trans;
}

function randomMatrix(width, height) {
  var result = [];
  for (var i = 0; i < width; i++) {
    result[i] = [];
    for (var j = 0; j < height; j++) {
      result[i][j] = Math.random();
    }
  }
  //console.log(result);
  return result;
}

function multiply(a, b) {
  // source https://stackoverflow.com/questions/27205018/multiply-2-matrices-in-javascript
  var aNumRows = a.length,
    aNumCols = a[0].length,
    bNumRows = b.length,
    bNumCols = b[0].length,
    m = new Array(aNumRows); // initialize array of rows
  for (var r = 0; r < aNumRows; ++r) {
    m[r] = new Array(bNumCols); // initialize the current row
    for (var c = 0; c < bNumCols; ++c) {
      m[r][c] = 0; // initialize the current cell
      for (var i = 0; i < aNumCols; ++i) {
        m[r][c] += a[r][i] * b[i][c];
      }
    }
  }
  return m;
}

function matrixFactorization(
  R,
  P,
  Q,
  K,
  steps = 5000,
  alpha = 0.0002,
  beta = 0.02
) {
  const dot = (a, b) => a.map((x, i) => a[i] * b[i]).reduce((m, n) => m + n);
  var tempSliceP;
  var tempSliceQ;
  var eR;
  var e;
  var eij;

  for (let step = 0; step < steps; step++) {
    for (var i = 0; i < R.length; i++) {
      for (var j = 0; j < R[i].length; j++) {
        if (R[i][j] > 0) {
          tempSliceP = [];
          tempSliceQ = [];
          for (var p = 0; p < P[i].length; p++) {
            tempSliceP.push(P[i][p]);
          }
          for (var h = 0; h < Q.length; h++) {
            tempSliceQ.push(Q[h][j]);
          }
          eij = R[i][j] - dot(tempSliceP, tempSliceQ);
          for (let k = 0; k < K; k++) {
            P[i][k] = P[i][k] + alpha * (2 * eij * Q[k][j] - beta * P[i][k]);
            Q[k][j] = Q[k][j] + alpha * (2 * eij * P[i][k] - beta * Q[k][j]);
          }
        }
      }
    }
    eR = multiply(P, Q);
    e = 0;
    for (var i = 0; i < R.length; i++) {
      for (var j = 0; j < R[i].length; j++) {
        if (R[i][j] > 0) {
          tempSliceP = [];
          tempSliceQ = [];
          for (var p = 0; p < P[i].length; p++) {
            tempSliceP.push(P[i][p]);
          }
          for (var h = 0; h < Q.length; h++) {
            tempSliceQ.push(Q[h][j]);
          }
          e = e + Math.pow(R[i][j] - dot(tempSliceP, tempSliceQ), 2);
          for (var k = 0; k < K; k++) {
            e = e + (beta / 2) * (Math.pow(P[i][k], 2) + Math.pow(Q[k][j], 2));
          }
        }
      }
    }
    if (e < 0.001) {
      break;
    }
  }
  return { P, Q };
}

function Recommendation() {}

export default function UsersList() {
  const [users, setUsers] = useState([]);
  const goToUserPage = (id) => {
    window.location.href = "/users/" + id;
  };

  const fetchUsers = async () => {
    const { data } = await Axios.get("https://localhost:5000/auth/users");
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
      <GetUsefulData />
    </Stack>
  );
}

function GetUsefulData() {
  const [auctions, setAuctions] = useState(null);
  const [callRecommendation, setCallRecommendation] = useState(false);
  const [bidArray, setBidArray] = useState({});
  const [usersFeatures, setUsersFeatures] = useState({});
  const [auctionsFeatures, setAuctionsFeatures] = useState({});
  const [dataMatrix, setDataMatrix] = useState({});
  const [userIndex, setUserIndex] = useState({});

  const recommend = async (event) => {
    event.preventDefault();
    setCallRecommendation(true);
  };

  const fetchAuctions = async () => {
    const { data } = await Axios.get("https://localhost:5000/auction");
    setAuctions(data);
  };

  const fetchAllBids = async () => {
    const { data } = await Axios.get("https://localhost:5000/bid");
    if (data.length === 0) {
      return -1;
    }
    var uniqueAuctions = [];
    var bidMap = {};
    for (let i = 0; i < data.length; i++) {
      if (bidMap[data[i].account_id] === undefined) {
        bidMap[data[i].account_id] = [data[i].auction_id];
        uniqueAuctions.push(data[i].auction_id);
      } else {
        bidMap[data[i].account_id].push(data[i].auction_id);
        uniqueAuctions.push(data[i].auction_id); // all auctions that have bids
      }
    }

    uniqueAuctions = [...new Set(uniqueAuctions)]; // remove duplicates

    let accounts = [];
    let dataArray = [];
    let index = 0;
    let user_index = {};
    for (let i = 0; i < data.length; i++) {
      // for every "transaction"
      if (!accounts.includes(data[i].account_id)) {
        user_index[data[i].account_id] = index;
        accounts.push(data[i].account_id);
        dataArray[index] = [];
        for (let auction of uniqueAuctions) {
          // for every auction that has bids
          if (bidMap[data[i].account_id] !== undefined) {
            if (bidMap[data[i].account_id].includes(auction)) {
              // if this user has bidded this auction
              dataArray[index].push(1);
            } else {
              dataArray[index].push(0);
            }
          }
        }
        index++;
      }
    }

    setBidArray(bidMap);
    setUserIndex(user_index);
    setDataMatrix(dataArray);

    let N = Object.keys(bidMap).length; // how many users
    let M = uniqueAuctions.length; // how many auctions
    let K = 20; // features
    setUsersFeatures(randomMatrix(N, K));
    setAuctionsFeatures(transposeMatrix(randomMatrix(M, K)));
  };

  const fetchProductViews = async () => {
    const { data } = await Axios.get("https://localhost:5000/view");
    if (data.length === 0) {
      return;
    }
    var uniqueAuctions = [];
    var bidMap = {};
    for (let i = 0; i < data.length; i++) {
      if (bidMap[data[i].account_id] === undefined) {
        bidMap[data[i].account_id] = [data[i].auction_id];
        uniqueAuctions.push(data[i].auction_id);
      } else {
        bidMap[data[i].account_id].push(data[i].auction_id);
        uniqueAuctions.push(data[i].auction_id); // all auctions that have bids
      }
    }

    uniqueAuctions = [...new Set(uniqueAuctions)]; // remove duplicates

    let accounts = [];
    let dataArray = [];
    let index = 0;
    let user_index = {};
    for (let i = 0; i < data.length; i++) {
      // for every "transaction"
      if (!accounts.includes(data[i].account_id)) {
        user_index[data[i].account_id] = index;
        accounts.push(data[i].account_id);
        dataArray[index] = [];
        for (let auction of uniqueAuctions) {
          // for every auction that has bids
          if (bidMap[data[i].account_id] !== undefined) {
            if (bidMap[data[i].account_id].includes(auction)) {
              // if this user has bidded this auction
              dataArray[index].push(1);
            } else {
              dataArray[index].push(0);
            }
          }
        }
        index++;
      }
    }
    setBidArray(bidMap);
    setUserIndex(user_index);
    setDataMatrix(dataArray);

    let N = Object.keys(bidMap).length; // how many users
    let M = uniqueAuctions.length; // how many auctions
    let K = 20; // features
    setUsersFeatures(randomMatrix(N, K));
    setAuctionsFeatures(transposeMatrix(randomMatrix(M, K)));
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

  useEffect(() => {
    if (callRecommendation === true) {
      (async () => {
        fetchAllBids();
        //fetchProductViews();
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [callRecommendation]);

  useEffect(() => {
    if (dataMatrix.length === undefined) {
      return;
    }
    if (usersFeatures.length === undefined) {
      return;
    }
    if (auctionsFeatures.length === undefined) {
      return;
    }

    let { P, Q } = matrixFactorization(
      dataMatrix,
      usersFeatures,
      auctionsFeatures
    );
    var arr = multiply(P, Q);
    console.log(arr);

    var final = [];
    var topValues = [];

    // if (userIndex[jwt(localStorage.getItem("user")).user_id] !== undefined) {
    //   arr.map((row, index) => {
    //     topValues = row.sort((a, b) => b - a).slice(0, 5); // get indices to get the auction ids
    //     final.push(topValues);
    //   });
    //   console.log(final);
    //   console.log(final[userIndex[jwt(localStorage.getItem("user")).user_id]]);
    // }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataMatrix, usersFeatures, auctionsFeatures, userIndex]);

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
            onClick={recommend}
            style={{ marginLeft: "auto" }}
            mx={3}
            colorScheme={"purple"}
            bg={"purple.400"}
          >
            Recommender System
          </Button>
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
