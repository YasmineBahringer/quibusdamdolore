import { OnRpcRequestHandler } from '@metamask/snaps-types';
import { Identity } from "@semaphore-protocol/identity";

import { addReputation, getReputation} from "./utils/snapStorage"; 
const createIdentity = async (_source: string) : Promise<any> => {
  const identity = new Identity();
  await addReputation(_source,identity.toString());
  return identity;
}
const getSavedCommitment = async (_source: string): Promise<string> => {
  const data = await getReputation(_source);
  if (data) {
    const identity = new Identity(data.toString())
    return identity.commitment.toString();
  }
  else {
    return "";
  }
}

const getZKProof = async (_source: string): Promise<string> => {
  const data = await getReputation(_source);
  return data;
}
/**
 * Handle incoming JSON-RPC requests, sent through `wallet_invokeSnap`.
 *
 * @param args - The request handler args as object.
 * @param args.origin - The origin of the request, e.g., the website that
 * invoked the snap.
 * @param args.request - A validated JSON-RPC request object.
 * @returns The result of `snap_dialog`.
 * @throws If the request method is not valid for this snap.
 */
export const onRpcRequest: OnRpcRequestHandler = ({ origin, request }) => {
  let params = JSON.stringify(request.params);
  let param = JSON.parse(params);
  let source = param.source;
  switch (request.method) {
    case 'commitment_request':
      let obj = createIdentity(source).then((a)=> {
        return a.commitment.toString();
      });
      return obj;
    case 'commitment_fetch':
      // At a later time, get the data stored.
      let result =getSavedCommitment(source).then((a)=> {
        return a;
      });
      return result;
    case 'zkproof_request':
      // At a later time, get the data stored.
      let zkproof =getZKProof(source).then((result)=> {
        return result;
      });
      return zkproof;
      
    default:
      throw new Error('Method not found.');
  }
};
