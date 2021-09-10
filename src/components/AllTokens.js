import { Flex, Text, Button,Grid } from "@chakra-ui/react";
import { useClaimedByTokenId } from "../hooks";
import CheckPaper from './Token.js'
import { useState } from "react";

import axios from 'axios';
import { ethers } from "ethers";

export function AllTokens(){
  const [state, setState] = useState("");

  var rows = [];

  for (var i = 600; i < 1000; i++) {
    rows.push(CheckPaper({tokenId: i}));
  }
  var temp = [];
  for(let i of rows)
    i && temp.push(i)
  rows = temp;

  console.log("How many are unclaimed:" + rows.length)
  return(
    <Grid templateColumns="repeat(20, 1fr)" rowGap={1} gap={1} >
    {rows}
    </Grid>
  )
}


export default CheckPaper;
