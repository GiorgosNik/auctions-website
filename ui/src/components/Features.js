import { ReactElement } from "react";
import { Box, SimpleGrid, Icon, Text, Stack, Flex } from "@chakra-ui/react";
import { FcAssistant, FcDonate, FcInTransit } from "react-icons/fc";

interface FeatureProps {
  title: string;
  text: string;
  icon: ReactElement;
}

const Feature = ({ title, text, icon }: FeatureProps) => {
  return (
    <Stack>
      <Flex
        w={16}
        h={16}
        align={"center"}
        justify={"center"}
        color={"white"}
        rounded={"full"}
        bg={"gray.100"}
        mb={1}
      >
        {icon}
      </Flex>
      <Text fontWeight={600}>{title}</Text>
      <Text color={"gray.600"}>{text}</Text>
    </Stack>
  );
};

export default function SimpleThreeColumns() {
  return (
    <Box p={4} bg={"purple.100"}>
      <SimpleGrid padding={20} columns={{ base: 1, md: 3 }} spacing={2}>
        <Feature
          icon={<Icon as={FcAssistant} w={10} h={10} />}
          title={"Secure communication"}
          text={
            "Our live buyer-seller chatting platform guarantees flexibility and security for every purchase."
          }
        />
        <Feature
          icon={<Icon as={FcDonate} w={10} h={10} />}
          title={"No hidden fees"}
          text={
            "Shop through our expansive catalog, being sure that for each price tag, we guarantee that what you see is what you get."
          }
        />
        <Feature
          icon={<Icon as={FcInTransit} w={10} h={10} />}
          title={"Instant Delivery"}
          text={
            "We work hand in hand with the leading courier companies and offer flexible shipping solutions on all items."
          }
        />
      </SimpleGrid>
    </Box>
  );
}
