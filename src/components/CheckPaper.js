import { Flex, Text, Button } from "@chakra-ui/react";
import { useClaimedByTokenId } from "../hooks";

function CheckPaper() {
    let input = 697; // doing this next..

  let v = useClaimedByTokenId(input);
  return (
    <Flex direction="column" align="center" mt="4">
      <Text color="white" fontSize="8xl"></Text>
      <Button colorScheme="teal" size="lg" onClick={useClaimedByTokenId}>
        Check Paper
      </Button>
    </Flex>
  );
}

export default CheckPaper;
