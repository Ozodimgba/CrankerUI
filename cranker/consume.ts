import { AnchorProvider, BN, Wallet } from "@coral-xyz/anchor";
import {
  Connection,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { MarketAccount, OpenBookV2Client } from "./ts/client/src";
import { RPC, authority, programId } from "./utils";


async function consumeEvents() {
  try {
    const wallet = new Wallet(authority);
    const provider = new AnchorProvider(new Connection(RPC), wallet, {
      commitment: "confirmed",
    });
    const marketPubkey = new PublicKey("8tnQJ5FG1SiB1rdpoyP8gFULjTU8BGiVXzabTUuSBrQB");

    const OPENBOOK_PROGRAM_ID = new PublicKey(
      'opnb2LAfJYbRMAHHvqjCwQxanZn7ReEHp1k81EohpZb',
    );

    const client = new OpenBookV2Client(provider, programId);

    const marketObject = await client.getMarket(marketPubkey)
    // console.log(marketObject)

    if (!marketObject) {
      throw "No market";
    }

    const limit = new BN(4)

    const remainingAccts: PublicKey[] = await client.getAccountsToConsume(marketObject)

    if(remainingAccts.length > 0) {
      const tx = await client.consumeEvents(marketPubkey, marketObject, limit, remainingAccts)
      console.log(tx)
    }
    
  } catch (error) {
    console.error("An error occurred:", error);
  }
}


consumeEvents();