import { Flex, Text, Button,Grid } from "@chakra-ui/react";
import { useClaimedByTokenId } from "../hooks";
import { useState } from "react";
import { Link } from "@chakra-ui/react"
import { ExternalLinkIcon } from '@chakra-ui/icons'

import axios from 'axios';
import { ethers } from "ethers";
import React, { Component } from 'react';


export class AllTokens extends React.Component {
  state = {
    numChildren: 0,
    prices: {}
  }



  constructor () {
    super();
    this.startToken = 6430;
    this.endToken = 8000;
  }

  render () {
    const children = [];

    for (var i = 0; i < this.state.numChildren; i += 1) {
      children.push(<ChildComponent key={i} tokenId={i + this.startToken} price={this.state.prices[i + this.startToken]} />);
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
    this.CheckOpenSea(this.state.numChildren + this.startToken);
  }

  startChecking = () => {
    this.CheckOpenSea(this.state.numChildren + this.startToken);
  }

   CheckOpenSea = function(tokenId){
     var that = this;
     console.log(tokenId, "Checking OpenSea");

     if( tokenId >= this.startToken && tokenId <= this.endToken  ){
      try {
        let address = '0x8707276df042e89669d69a177d3da7dc78bd8723';

        axios.get(`https://api.opensea.io/api/v1/assets?token_ids=${tokenId}&asset_contract_address=${address}&order_direction=desc&offset=0&limit=20`).then(function(openseaResult){
            //console.log(openseaResult);
            if (openseaResult.data.assets[0] !== undefined && openseaResult.data.assets[0].sell_orders) {
              let p = openseaResult.data.assets[0].sell_orders[0].current_price;
              let price;
              try {
                 price = Number(ethers.utils.formatEther(p)).toFixed(1);
              } catch {
                 price = Number(99999);
              }
              console.log(tokenId, ' Price is:', price, 'ETH ',openseaResult.data.assets[0].sell_orders[0] );

              that.state.prices[tokenId] = price;
            } else {
              console.log(tokenId, ' DWL is not for sale ');
              that.state.prices[tokenId] = '.';
            }
            setTimeout(that.onAddChild, 0.5 * 1000)
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

  <Button  fontSize="1m" href="#" onClick={props.addChild}>Start</Button>
  <Grid templateColumns="repeat(20, 1fr)" rowGap={2} gap={2} >
      {props.children}
   </Grid>
   </Flex>
);

// class ChildComponent extends React.Component
// {
//
//
//     render(){
//       let v = useClaimedByTokenId(this.props.number);
//       if(v.toString() === 'false') {
//         this.state.claimed = false;
//       } else {
//         this.state.claimed = true;
//       }
//       return (<Link href={"https://opensea.io/assets/0x8707276df042e89669d69a177d3da7dc78bd8723/" + this.props.number} isExternal>
//       <Text color="white" fontSize="1m">{this.props.price}</Text> <ExternalLinkIcon mx="2px" />
//       </Link>);
//     }
// }

function areEqual(prevProps, nextProps) {
  //console.log("Callind are Equal on ", prevProps, nextProps);
  return true;
}
const ChildComponent = React.memo(function ChildComponent(props) {

  let v = useClaimedByTokenId(props.tokenId);
  let claimed = v.toString() !== 'false';
  //console.log(props.tokenId," Claimed ", claimed, " Price", props.price);
  if(props.price > 0){
    console.log(props.tokenId," Claimed ", claimed, " Price", props.price);
  }

  if(!claimed && props.price < 0.3){
    console.log(props.tokenId," YAY : Claimed ", claimed, " Price", props.price);
  }
  let color = "white"
  if(!claimed){
    color = "blue";
  }
  return (
  <Link href={"https://opensea.io/assets/0x8707276df042e89669d69a177d3da7dc78bd8723/" + props.tokenId} isExternal>
  <Text color={color} fontSize="1m">{props.price} {claimed}</Text> <ExternalLinkIcon mx="2px" />
  </Link>);
},areEqual);

export default AllTokens;
