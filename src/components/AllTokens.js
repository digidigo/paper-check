import { Flex, Text, Button,Grid } from "@chakra-ui/react";
import { useClaimedByTokenId } from "../hooks";
import { useState } from "react";
import { Link } from "@chakra-ui/react"
import { ExternalLinkIcon } from '@chakra-ui/icons'

import axios from 'axios';
import { ethers } from "ethers";
import React, { Component } from 'react';

// export function AllTokens(){
//
//   var rows = [];
//
//   for (var i = 0; i < 500; i++) {
//     rows.push(CheckPaper({tokenId: i}));
//   }
//   var temp = [];
//   for(let i of rows)
//     i && temp.push(i)
//   rows = temp;
//
//   console.log("How many are unclaimed:" + rows.length)
//   return(
//     <Grid templateColumns="repeat(20, 1fr)" rowGap={2} gap={2} >
//     {rows}
//     </Grid>
//   )
// }




export class AllTokens extends React.Component {
  state = {
    numChildren: 0
  }

  constructor () {
    super();
    this.state.prices = {};
  }

  render () {
    const children = [];

    for (var i = 0; i < this.state.numChildren; i += 1) {
      children.push(<ChildComponent key={i} number={i} price={this.state.prices[i]} />);
    };

    return (
      <ParentComponent addChild={this.startChecking}>
        {children}
      </ParentComponent>
    );
  }

  onAddChild = () => {
    this.setState({
      numChildren: this.state.numChildren + 1
    });
    this.CheckOpenSea(this.state.numChildren);
  }

  startChecking = () => {
    this.CheckOpenSea(this.state.numChildren);
  }

   CheckOpenSea = function(tokenId){
     var that = this;
     if(tokenId < 8000 ){
      try {
        let address = '0x8707276df042e89669d69a177d3da7dc78bd8723';
        console.log(tokenId, "Checking OpenSea");

        axios.get(`https://api.opensea.io/api/v1/assets?token_ids=${tokenId}&asset_contract_address=${address}&order_direction=desc&offset=0&limit=20`).then(function(openseaResult){
            //console.log(openseaResult);
            if (openseaResult.data.assets[0] !== undefined && openseaResult.data.assets[0].sell_orders) {
              let p = openseaResult.data.assets[0].sell_orders[0].current_price;
              console.log(tokenId, ' Price is:', ethers.utils.formatEther(p), 'ETH ' );
              that.state.prices[tokenId] = Number(ethers.utils.formatEther(p)).toFixed(1);
            } else {
              console.log(tokenId, ' DWL is not for sale ');
              that.state.prices[tokenId] = 'x';
            }
            setTimeout(that.onAddChild, 1.0*1000)
        });

      } catch (error) {
        console.error(error);
      }
    }
  }
}

const ParentComponent = props => (
  <Flex
    flexDirection="column"
    alignItems="center"
    justifyContent="top"
    h="1000vh"
    bg="gray.800"
  >

  <Text color="white" fontSize="1m" href="#" onClick={props.addChild}>Add Another Child Component</Text>
  <Grid templateColumns="repeat(20, 1fr)" rowGap={2} gap={2} >
      {props.children}
   </Grid>
   </Flex>
);

const ChildComponent = props =>
(
  <Link href={"https://opensea.io/assets/0x8707276df042e89669d69a177d3da7dc78bd8723/" + props.number} isExternal>
  <Text color="white" fontSize="1m">{props.price}</Text> <ExternalLinkIcon mx="2px" />
  </Link>
)

export default AllTokens;
