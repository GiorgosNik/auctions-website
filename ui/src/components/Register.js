import {
    Box,
    Text,
    Button,
    Stack,
    useColorModeValue,
    FormControl,
    FormLabel,
    Input,
    InputGroup,
    HStack,
    InputRightElement,
    Heading,
    CloseButton,
    Checkbox, 
    Radio, 
    RadioGroup,
  } from '@chakra-ui/react';
import { useState, useCallback } from 'react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';

export default function SignupCard({ onRegisterChange }) {
    const [showPassword, setShowPassword] = useState(false);
    const closeModal = useCallback(event => {
      onRegisterChange(event.target.value)
    }, [onRegisterChange])
  
    return (
        <Stack spacing={8} mx={'auto'} maxW={'lg'} px={6}>
          <Box 
            position={"absolute"}
            rounded={'lg'}
            bg={useColorModeValue('white', 'gray.700')}
            boxShadow={'lg'}
            p={9}>
            <CloseButton style={{float: 'right'}} onClick={closeModal}/>
            <Stack align={'center'}>
                <Heading fontSize={'4xl'} textAlign={'center'}>
                  Sign up
                </Heading>
                <Text fontSize={'lg'} color={'gray.600'} paddingBottom={7}>
                  to enjoy all of our cool features ✌️
                </Text>
          </Stack>
            <Stack spacing={4}>
            <RadioGroup defaultValue='1' >
              <Stack spacing={5} direction='row'>
                <Radio colorScheme='purple' value='1'>
                  as Bidder
                </Radio>
                <Radio colorScheme='purple' value='2'>
                  as Seller
                </Radio>
              </Stack>
            </RadioGroup>
              <HStack>
                <Box>
                  <FormControl id="firstName" isRequired>
                    <FormLabel>First Name</FormLabel>
                    <Input type="text" />
                  </FormControl>
                </Box>
                <Box>
                  <FormControl id="lastName" isRequired>
                    <FormLabel>Last Name</FormLabel>
                    <Input type="text" />
                  </FormControl>
                </Box>
              </HStack>
              <HStack>
                <Box>
                  <FormControl id="email" isRequired>
                    <FormLabel>Email address</FormLabel>
                    <Input type="email" />
                  </FormControl>
                </Box>
                <Box>
                  <FormControl id="phone" isRequired>
                    <FormLabel>Phone number</FormLabel>
                    <Input type="tel" />
                  </FormControl>
                </Box>
              </HStack>

              <HStack>
                <Box>
                  <FormControl id="country" isRequired>
                    <FormLabel>Country</FormLabel>
                    <Input type="text" />
                  </FormControl>
                </Box>
                <Box>
                  <FormControl id="address" isRequired>
                    <FormLabel>Address</FormLabel>
                    <Input type="text" />
                  </FormControl>
                </Box>
              </HStack>

              <HStack>
                <Box>
                  <FormControl id="postcode" isRequired>
                    <FormLabel>Postcode</FormLabel>
                    <Input type="text" />
                  </FormControl>
                </Box>
                <Box>
                  <FormControl id="taxcode" isRequired>
                    <FormLabel>Tax Code</FormLabel>
                    <Input type="text" />
                  </FormControl>
                </Box>
              </HStack>


              <HStack>
                <Box>
                  <FormControl id="password" isRequired>
                  <FormLabel>Password</FormLabel>
                    <Input type={showPassword ? 'text' : 'password'} />
                </FormControl>
                </Box>
                <Box>
                    <FormControl id="confirm" isRequired>
                    <FormLabel>Confirm password</FormLabel>
                    <InputGroup>
                      <Input type={showPassword ? 'text' : 'password'} />
                      <InputRightElement h={'full'}>
                        <Button
                          variant={'ghost'}
                          onClick={() =>
                            setShowPassword((showPassword) => !showPassword)
                          }>
                          {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                        </Button>
                      </InputRightElement>
                    </InputGroup>
                  </FormControl>
                </Box>
              </HStack>


              
              
              <FormControl id="checkbox" isRequired>
                <Checkbox size='lg' colorScheme='purple' defaultChecked>
                <FormLabel>
                  I have read and accept the terms and conditions.
                </FormLabel>
                </Checkbox>
              </FormControl>

              <Stack spacing={10} pt={2}>
                <Button
                  loadingText="Submitting"
                  size="lg"
                  bg={'purple.400'}
                  color={'white'}
                  _hover={{
                    bg: 'purple.500',
                  }}>
                  Sign up
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Stack>
    );
  }