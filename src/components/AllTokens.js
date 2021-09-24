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
    prices: {},
    currentTokenId: 0,
    ready: false
  }

  setReady = () => {
    this.state.numChildren = Object.keys(this.state.prices).length;
    console.log("Ready:",this.state.numChildren);
    this.state.ready = true;
    this.setState(this.state);
  }

  constructor () {
    super();
    this.startToken = 0;
    this.endToken = 8000;
    this.state.currentTokenId = this.startToken;
    this.state.ready = false;
  }

  render () {
    const children = [];

    // for (var i = 0; i < this.state.numChildren; i += 1) {
    //   children.push(<ChildComponent key={i} tokenId={i + this.startToken} price={this.state.prices[i + this.startToken]} />);
    // };
    console.log("rendering", this.state.numChildren);
    var that = this;
    if( this.state.ready ){
      Object.keys(this.state.prices).forEach(function (tokenId) {
        console.log("Rendering Child for ", tokenId);
        children.push(<ChildComponent key={tokenId} tokenId={tokenId} price={that.state.prices[tokenId]} />);
      })
    }

    var duration = (new Date() - this.state.startDate ) / 1000;
    var totalProcessed = this.state.currentTokenId;
    var speed = duration / totalProcessed;
    var totalLeft = (this.endToken - this.state.currentTokenId)/60;
    //console.log("Speed ",this.endToken);

    var timeLeft = totalLeft / speed ;
    timeLeft = Math.floor( timeLeft );
    duration = Math.floor( duration);
    return (
      <ParentComponent addChild={this.startChecking}>
      <Text color="white" fontSize="1m">TID : {this.state.currentTokenId}</Text>
      <Text color="white" fontSize="1m">FS : {Object.keys(this.state.prices).length}</Text>
      <Text color="white" fontSize="1m">{duration} : {timeLeft}</Text>
        {children}
      </ParentComponent>
    );
  }

  // onAddChild = () => {
  //   this.setState({
  //     numChildren: this.state.numChildren + 1
  //   });
  //   this.CheckOpenSea(this.state.numChildren + this.startToken);
  // }
  checkNext = () => {
    this.state.currentTokenId = this.state.currentTokenId + 1;
    this.setState(this.state);
    this.CheckOpenSea();
  }

  startChecking = () => {
    this.CheckOpenSea();
    this.state.startDate = new Date();
  }

   CheckOpenSea = function(){
     var that = this;
     let tokenId = that.state.currentTokenId;
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
                 if(price > 999){
                   price = 999;
                 }
              } catch {
                 price = Number(999);
              }
              console.log(tokenId, ' Price is:', price, 'ETH ',openseaResult.data.assets[0].sell_orders[0] );

              that.state.prices[tokenId] = price;
            } else {
              console.log(tokenId, ' DWL is not for sale ');
              //that.state.prices[tokenId] = '.';
            }
            setTimeout(that.checkNext, 0.1 * 1000)
        });

      } catch (error) {
        console.error(error);
      }
    } else {
      that.setReady();
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
