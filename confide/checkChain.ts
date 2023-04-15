import CONFIDE_ABI from "./Confide.json";

import {ethers} from 'ethers';

export const checkConnected = (async(transactionHash: string) => {
    const provider = new ethers.providers.JsonRpcProvider();
    const contract = new ethers.utils.Interface(CONFIDE_ABI);


    const txn = await provider.getTransaction(transactionHash);

    const func = contract.parseTransaction(txn);


    if (func.name === 'postConnected' || func.name == 'postConnected5Degrees') {
        const args = func.args;
        return {func: func.name, a: args[0], b: args[1], path: args[2]};
    }

})
