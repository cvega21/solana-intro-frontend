import * as Web3 from '@solana/web3.js'

export const createAndExecuteTxFromInstructions = async (instructions: Web3.TransactionInstruction[], connection: Web3.Connection, payer: Web3.Keypair) => {
  const transaction = new Web3.Transaction();
  for (let step of instructions) transaction.add(step);

  const txSig = await Web3.sendAndConfirmTransaction(
    connection,
    transaction,
    [payer]
  )
  
  logDevSolExplorerLink(txSig);
}

export const logDevSolExplorerLink = (txSig: string) => {
  console.log(`You can view your transaction on the Solana Explorer at:\nhttps://explorer.solana.com/tx/${txSig}?cluster=devnet`)
}