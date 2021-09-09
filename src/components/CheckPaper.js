import { Flex, Text, Button } from "@chakra-ui/react";
import { useClaimedByTokenId } from "../hooks";

function CheckPaper() {
    let input = 697; // doing this next..
    let checkIsClaimedByTokenId = function() {
      let v = useClaimedByTokenId(input);
      console.log(v);
      return v;
    }

  return (
    <Flex direction="column" align="center" mt="4">
      <Text color="white" fontSize="8xl"></Text>
      <Button colorScheme="teal" size="lg" onClick={checkIsClaimedByTokenId}>
        Check Paper
      </Button>
    </Flex>
  );
}

export default CheckPaper;
