import React, { useState, useEffect, ReactElement } from "react";
import {
  Stack,
  Box,
  Text,
  Icon,
  Flex,
  SimpleGrid,
  LinkBox,
  LinkOverlay,
  Center,
  useColorModeValue,
  Heading,
  Image,
} from "@chakra-ui/react";
import Axios from "axios";

function getIndex(array, element) {
  for (var i = 0; i < array.length; i++) {
    if (array[i] === element) {
      return i;
    }
  }
  return -1;
}

function transposeMatrix(matrix) {
  let trans = [];
  for (let i = 0; i < matrix[0].length; i++) {
    let temp = [];
    for (let j = 0; j < matrix.length; j++) {
      temp.push(matrix[j][i]);
    }
    trans.push(temp);
  }
  //console.log(trans);
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

function dotProduct(v1, v2) {
  let sum = 0;
  for (let i = 0; i < v1.length; i++) {
    sum += v1[i] * v2[i];
  }
  return sum;
}

function multiply(a, b) {
  // sourse https://stackoverflow.com/questions/27205018/multiply-2-matrices-in-javascript
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
          for (k = 0; k < K; k++) {
            P[i][k] = P[i][k] + alpha * (2 * eij * Q[k][j] - beta * P[i][k]);
            Q[k][j] = Q[k][j] + alpha * (2 * eij * P[i][k] - beta * Q[k][j]);
          }
        }
      }
    }
    eR = multiply(P, Q);
    e = 0;
    for (var i = 0; i < R.length; i++) {
      for (var j = 0; i < R[i].length; j++) {
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
}

const Feature = () => {
  return (
    <Stack>
      <ProductCard />
    </Stack>
  );
};

export default function Suggestions() {
  var [bidArray, setBidArray] = useState({});
  var [usersFeatures, setUsersFeatures] = useState({});
  var [auctionsFeatures, setAuctionsFeatures] = useState({});
  var uniqueAuctions = [];
  var dataArray = [];
  const fetchAllBids = async () => {
    const { data } = await Axios.get("https://localhost:5000/bid");
    var bidMap = {};
    for (let i = 0; i < data.length; i++) {
      if (bidMap[data[i].account_id] === undefined) {
        bidMap[data[i].account_id] = [data[i].auction_id];
        uniqueAuctions.push(data[i].auction_id);
      } else {
        bidMap[data[i].account_id].push(data[i].auction_id);
        uniqueAuctions.push(data[i].auction_id);
      }
    }

    setBidArray(bidMap);
    uniqueAuctions = [...new Set(uniqueAuctions)];

    for (let i = 0; i < data.length; i++) {
      dataArray.push([]);
      for (let auction of uniqueAuctions) {
        if (bidMap[data[i].account_id] !== undefined) {
          if (bidMap[data[i].account_id].includes(auction)) {
            dataArray.push(1);
          } else {
            dataArray.push(0);
          }
        }else{
          dataArray.push(0);
        }
      }
    }
    
    let N = Object.keys(bidMap).length;
    let M = uniqueAuctions.length;
    let K = 20;
    setUsersFeatures(randomMatrix(N, K));
    setAuctionsFeatures(transposeMatrix(randomMatrix(M, K)));
  };

  useEffect(() => {
    fetchAllBids();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Box p={4}>
      <SimpleGrid padding={15} columns={{ base: 1, md: 5 }} spacing={2}>
        <Feature />
      </SimpleGrid>
    </Box>
  );
}

function ProductCard({
  productName,
  sellerUsername,
  price,
  buyoutPrice,
  id,
  image,
}) {
  const goToAuctionPage = (id) => {
    window.location.href = "/auction/" + id;
  };

  if (image === null) {
    image = "https://localhost:5000/images/37375020.jpg";
  }
  return (
    <LinkBox
      as="article"
      maxW="sm"
      p="5"
      borderWidth="0px"
      rounded="md"
      style={{ cursor: "pointer" }}
    >
      <Center py={12}>
        <Box
          role={"group"}
          style={{ zIndex: "0" }}
          p={6}
          maxW={"330px"}
          w={"full"}
          bg={useColorModeValue("white", "gray.800")}
          boxShadow={"2xl"}
          rounded={"lg"}
          pos={"relative"}
        >
          <LinkOverlay onClick={() => goToAuctionPage(id)}>
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
                backgroundImage: `url(${image})`,
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
                src={image}
              />
            </Box>
            <Stack pt={10} align={"center"}>
              <Text
                color={"gray.500"}
                fontSize={"sm"}
                textTransform={"uppercase"}
              >
                {sellerUsername + " " + id}
              </Text>
              <Heading fontSize={"2xl"} fontFamily={"body"} fontWeight={500}>
                {productName}
              </Heading>
              <Stack direction={"row"} align={"center"}>
                <Text fontWeight={800} fontSize={"xl"}>
                  ${price}
                </Text>
                <Text color={"gray.600"}>{buyoutPrice}</Text>
              </Stack>
            </Stack>
          </LinkOverlay>
        </Box>
      </Center>
    </LinkBox>
  );
}
