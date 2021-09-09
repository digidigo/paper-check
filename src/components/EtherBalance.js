import { formatEther } from '@ethersproject/units'
import { useEthers, useEtherBalance } from "@usedapp/core";


export default function EtherBalance() {
  const { account } = useEthers()
  const etherBalance = useEtherBalance(account)

  return (
    <div>
      {etherBalance && <p>Balance: {formatEther(etherBalance)}</p>}
    </div>
  )
}
