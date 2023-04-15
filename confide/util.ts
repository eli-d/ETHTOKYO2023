import {ethers} from "ethers";
import CONFIDE_ABI from "./Confide.json";
import { promptPost } from "./snap.ts";

export enum Trust {
    NONE=0,
    VERIFY=1,
    VOUCH=2,
    CONFIDE=3   
};

export enum Authenticity {
    NONE,
    AUTHENTIC
};

export type Account = {
    address: string;
    trust: Trust;    
    authenticity: Authenticity;
}

export const CONFIDE_CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
export const ConfideContract = (async(signer?: ethers.providers.JsonRpcSigner) => {
    if (!signer) {
        const provider = new ethers.providers.JsonRpcProvider();
        signer = await provider.getSigner();
    }
        
    return new ethers.Contract(CONFIDE_CONTRACT_ADDRESS, CONFIDE_ABI, signer);
})

export const getTrustedAccounts = async(address: string): Promise<Account[]> => {
    const contract = await ConfideContract();
    const edges: Array<[address: string, trust: Trust]> = await contract.getEdges(address);
    // TODO authenticity
    return edges.length === 0 ? [] : edges.map(([address, trust]) => ({address, trust, authenticity: Authenticity.NONE}))
}

// b64
export const createOwnerProof = async(myAddress: string, otherAddress: string): Promise<string> => {
    // sign a message with my account containing their address (and a nonce? time specific?)
    const provider = new ethers.providers.JsonRpcProvider();
    const signer = await provider.getSigner();
    return await signer.signMessage(otherAddress);
}

// return address that signed or null if incorrect
export const importOwnerProof = async(proof: string, expectedSigner: string, myAddress: string): Promise<string | null> => {
    const msg = myAddress; 
    const verifiedAddress = ethers.utils.verifyMessage(msg, proof);
    if (verifiedAddress !== expectedSigner)
        return null;
    return verifiedAddress;
}

// fetch trust
export const lookupAddress = async(myAddress: string, otherAddress: string): Promise<Account> => {
    const contract = await ConfideContract();
    // TODO authenticity
    const trust = await contract.getTrustLevel(myAddress, otherAddress);
    return {
        address: otherAddress,
        trust: trust,
        // TODO authenticity
        authenticity: Authenticity.NONE
    }
}

export const trustAddress = async(myAddress: string, addressToTrust: string, level: Trust, signer?: ethers.providers.JsonRpcSigner) => {
    const contract = await ConfideContract(signer);
    await contract.trust(myAddress, addressToTrust, level);
}

export const revokeTrust = async(myAddress: string, addressToTrust: string) => {
    const contract = await ConfideContract();
    await contract.trust(myAddress, addressToTrust, Trust.NONE);
}

export const backtrace = (parent: Map<string, string>, a: string, b: string) => {
    let path = [b];
    while (path.at(path.length - 1) != a) {
        const g = parent.get(path[path.length - 1]);
        if (g)
            path.push(g);
        else throw new Error("should never happen")
    }
    path = path.reverse();

    if (path.length <= 5) {
        return path;
    }
    return [];
}

const findPath_ = async(a: string, b: string) => {
    const contract = await ConfideContract();

    let seen = new Set();
    
    let q: string[] = Array<string>();
    q.push(a);

    let parent = new Map<string, string>();

    while(q.length > 0) {
        // while length > 0 so always true
        const node = q.shift() as string;

        const edges = await contract.getEdges(node);

        for (let edge of edges) {
            const [address, trust] = edge;
            if (!seen.has(address) && trust > Trust.VERIFY) {
                parent.set(address, node)

                if (address === b) {
                    return backtrace(parent, a, b);
                }

                q.push(address);
                seen.add(address);
            } else if (trust > Trust.NONE) {
                if (address === b) {
                    parent.set(address, node);
                    return backtrace(parent, a, b);
                }
            }
       }
    }
    return []
};

// wrap as failed paths revert/throw
export const findPath = async(a: string, b: string) => {
    try {
        return await findPath_(a, b)
    } catch (e){
        return [];
    }
}

const findTrustedIntermediaries_ = async(a: string, b: string) => {
    const contract = await ConfideContract();

    const edges = await contract.getEdges(a);

    let partial: string[] = Array<string>();

    for (let edge of edges) {
        const {_address: address, trustLevel: trust} = edge;
        if (trust > 1) {
            if (await contract.getTrustLevel(address, b) > 1) {
                return [{address, trust: Trust.VOUCH}];
            }
        } else if (trust > 0) {
            if (await contract.getTrustLevel(address, b) > 1) {
                partial.push(address);
            }
        }
        if (partial.length == 3) {
            return partial.map(address => ({address, trust: Trust.VERIFY}));
        }
    }

    return partial.map(address => ({address, trust: Trust.VERIFY}));
}

// wrap as failed paths revert/throw
export const findTrustedIntermediaries = async(a: string, b: string) => {
    try {
        return await findTrustedIntermediaries_(a, b)
    } catch (e){
        return [];
    }
}

// Get path of trust between two parties and verify it on-chain
export const verifyTrust = async(myAddress: string, addressToTrust: string, signer?: ethers.providers.JsonRpcSigner) => {
    const contract = await ConfideContract(signer);

    if (await contract.getTrustLevel(myAddress, addressToTrust) > 1) {
        const resp = await contract.postConnected(myAddress, addressToTrust, []);
        return resp.wait().transactionHash;
    }

    const intermediaries = await findTrustedIntermediaries(myAddress, addressToTrust);

    if (intermediaries.length == 0) {
        return false;
    }
    try {
        const resp = await contract.postConnected(myAddress, addressToTrust, intermediaries);
        return resp.wait().transactionHash;
    } catch (e) {
        return false;
    }
}

// Get path of trust between two parties and verify it on-chain

export const verifyTrustPrompt = async(myAddress: string, addressToTrust: string, signer?: ethers.providers.JsonRpcSigner) => {
    const contract = await ConfideContract(signer);

    if (await contract.getTrustLevel(myAddress, addressToTrust) > 1) {
        promptPost(contract.interface.encodeFunctionData("postConnected", [myAddress, addressToTrust, []]));
        return;
    }

    const intermediaries = await findTrustedIntermediaries(myAddress, addressToTrust);

    if (intermediaries.length == 0) {
        return;
    }
    promptPost(contract.interface.encodeFunctionData("postConnected", [myAddress, addressToTrust, intermediaries]));
}

// Get path of trust between two parties and verify it on-chain
export const verifyTrustLocal = async(myAddress: string, addressToTrust: string, signer?: ethers.providers.JsonRpcSigner) => {
    const contract = await ConfideContract(signer);

    if (await contract.getTrustLevel(myAddress, addressToTrust) > 1) {
        return await contract.connected(myAddress, addressToTrust, []);
    }

    const intermediaries = await findTrustedIntermediaries(myAddress, addressToTrust);

    if (intermediaries.length == 0) {
        return false;
    }
    try {
        await contract.connected(myAddress, addressToTrust, intermediaries);
        return true;
    } catch (e) {
        return false;
    }
}

// Get path of authenticity (5 degrees) between two parties and verify it on-chain
export const verifyAuth = async(myAddress: string, addressToTrust: string, signer?: ethers.providers.JsonRpcSigner) => {
    const contract = await ConfideContract(signer);

    const path = await findPath(myAddress, addressToTrust);

    if (path.length == 0) {
        return false;
    }
    try {
        const resp = await contract.postConnected5Degrees(myAddress, addressToTrust, path.slice(1,path.length-1));
        return resp.wait().transactionHash;
    } catch (e) {
        return false;
    }
}

// Get path of authenticity (5 degrees) between two parties and verify it on-chain

export const verifyAuthPrompt = async(myAddress: string, addressToTrust: string, signer?: ethers.providers.JsonRpcSigner) => {
    const contract = await ConfideContract(signer);

    const path = await findPath(myAddress, addressToTrust);

    if (path.length == 0) {
        return false;
    }
    promptPost(contract.interface.encodeFunctionData("postConnected5Degrees", [myAddress, addressToTrust, path.slice(1,path.length-1)]));
}

// Get path of authenticity (5 degrees) between two parties and verify it on-chain
export const verifyAuthLocal = async(myAddress: string, addressToTrust: string, signer?: ethers.providers.JsonRpcSigner) => {
    const contract = await ConfideContract(signer);

    const path = await findPath(myAddress, addressToTrust);

    if (path.length == 0) {
        return false;
    }
    try {
        await contract.connected5Degrees(myAddress, addressToTrust, path.slice(1,path.length-1));
        return true;
    } catch (e) {
        return false;
    }
}

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
