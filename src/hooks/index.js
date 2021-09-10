// hooks/index.ts
import { ethers } from "ethers";
import { useContractCall } from "@usedapp/core";
import paperContractAbi from "../abi/PaperContract.json";
import { paperContractAddress } from "../contracts"
import { Contract } from "@ethersproject/contracts";

const paperContractInterface = new ethers.utils.Interface(paperContractAbi);
//const paperContract = new Contract(paperContractAddress, paperContractInterface);


export function useClaimedByTokenId(...args) {
  const count =
    useContractCall({
      abi: paperContractInterface,
      address: paperContractAddress,
      method: "claimedByTokenId",
      args: args,
    }) ?? [];
  console.log(" claimedByTokenId (" + count + ")");
  return count;
}
