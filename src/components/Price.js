import { Text } from "@chakra-ui/react";
import { useClaimedByTokenId } from "../hooks";
import axios from 'axios';
import { ethers } from "ethers";
import { useState } from "react";



export default function Price(props) {
  const [price, setPrice] = useState("");
  //setPrice('.');
  console.log("Rendering Price for ",props.tokenId);

  function CheckOpenSea(tokenId){
    try {
      let address = '0x8707276df042e89669d69a177d3da7dc78bd8723';
      console.log("Checking OpenSea",props.tokenId);

      axios.get(`https://api.opensea.io/api/v1/assets?token_ids=${tokenId}&asset_contract_address=${address}&order_direction=desc&offset=0&limit=20`).then(function(openseaResult){
          //console.log(openseaResult);

          if (openseaResult.data.assets[0].sell_orders) {
            let p = openseaResult.data.assets[0].sell_orders[0].current_price;
            console.log('Price is:', ethers.utils.formatEther(p), 'ETH');
            setPrice(Number(ethers.utils.formatEther(p)).toFixed(1));
          } else {
            setPrice('x');
            console.log('DWL is not for sale');
          }
      });

    } catch (error) {
      console.error(error);
    }
  }


  if(price) {
    CheckOpenSea(props.tokenId);
  } else {
    console.log(" Skipping OS Check:",price)
  }


  return (
      <Text color="white" fontSize="1m" key={props.tokenId}>{price || '.'}</Text>
  );
}
