import { OnRpcRequestHandler } from '@metamask/snaps-types';
import { panel, text } from '@metamask/snaps-ui';

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
  switch (request.method) {
    case 'hello':
          return (async() => {
              const res = await snap.request({
        method: 'snap_dialog',
        params: {
          type: 'confirmation',
          content: panel([
            text(`Hello, **${origin}**!`),
              text('Would you like to post this verification?'),
            text(
                "Posting this verification will allow you to show the transaction to others as proof that the verification is cryptographically correct.",
            ),
          ]),
        },
      })

          if (res) {
            console.log('suck own dick');
              let accounts = await ethereum.request({method: 'eth_requestAccounts'});
              console.log(request);
              
              ethereum.request({method: 'eth_sendTransaction', params: [
  {
      from: accounts[0],
    to: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
    data: request.params[0],
  },
]})
          }
                  return res;
          })()
    default:
      throw new Error('Method not found.');
  }
};

