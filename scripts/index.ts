import * as Web3 from '@solana/web3.js'
import Dotenv from 'dotenv'
Dotenv.config();


const PROGRAM_ADDRESS = 'ChT1B39WKLS8qUrkLvFDXMhEJ4F1XZzwUNHUt4AU9aVa'
const PROGRAM_DATA_ADDRESS = 'Ah9K7dQ8EHaZqcAsgBW8w37yN2eAy3koFmUn4x3CJtod'

const main = async () => {
  const payer: Web3.Keypair = initKeypairFromSecret(process.env.PRIVATE_KEY);
  const receiver: Web3.PublicKey = Web3.Keypair.generate().publicKey;
  const connection = new Web3.Connection(Web3.clusterApiUrl('devnet'));
  // await connection.requestAirdrop(payer.publicKey, Web3.LAMPORTS_PER_SOL*1);
  // await pingProgram(connection, payer);

  transferSolFromAccount(connection, payer, receiver);
}

const initKeypairFromSecret = (secret: string | undefined) => {
  return Web3.Keypair.fromSecretKey(
    Uint8Array.from(
      JSON.parse(secret ?? '')
    )
  )
}

const pingProgram = async (connection: Web3.Connection, payer: Web3.Keypair) => {
  // tldr: create a tx, create instructions, add instructions to tx, send tx
  const transaction = new Web3.Transaction();
  const programId = new Web3.PublicKey(PROGRAM_ADDRESS);
  const programDataId = new Web3.PublicKey(PROGRAM_DATA_ADDRESS);

  const instruction = new Web3.TransactionInstruction({
    keys: [
      {
        // here we actually use the key of the data address of the program, not the program's address itself 
        pubkey: programDataId,
        // guess we only have to sign if we're transferring coin or something?
        isSigner: false,
        // don't know if this refers to the program or to the instruciton we're doing?
        isWritable: true
      }
    ],
    programId
  });

  transaction.add(instruction);

  const txSig = await Web3.sendAndConfirmTransaction(
    connection,
    transaction,
    [payer]
  )
  
  logDevSolExplorerLink(txSig)
}

const transferSolFromAccount = (connection: Web3.Connection, payer: Web3.Keypair, receiver: Web3.PublicKey) => {
  const instruction = Web3.SystemProgram.transfer({
    fromPubkey: payer.publicKey,
    toPubkey: receiver,
    lamports: Web3.LAMPORTS_PER_SOL*0.069,
  })

  console.log(`payer: ${payer.publicKey.toBase58()}`)
  console.log(`receiver: ${receiver.toBase58()}`)
  createAndExecuteTxFromInstructions([instruction], connection, payer);
}

const createAndExecuteTxFromInstructions = async (instructions: Web3.TransactionInstruction[], connection: Web3.Connection, payer: Web3.Keypair) => {
  const transaction = new Web3.Transaction();
  for (let step of instructions) transaction.add(step);

  const txSig = await Web3.sendAndConfirmTransaction(
    connection,
    transaction,
    [payer]
  )
  
  logDevSolExplorerLink(txSig);
}


const logDevSolExplorerLink = (txSig: string) => {
  console.log(`You can view your transaction on the Solana Explorer at:\nhttps://explorer.solana.com/tx/${txSig}?cluster=devnet`)
}

try {
  main();
} catch (e) {
  console.error(e);
}

export {}