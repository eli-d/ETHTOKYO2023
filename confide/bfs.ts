import {ConfideContract, Trust} from "./util";
import {ethers} from "ethers";

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
        if (path.length )
        return path;//.slice(1,path.length-1);
    }
    return [];
}

const findPath_ = async(a: string, b: string) => {
    a = a.toLowerCase();
    b = b.toLowerCase();
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
            const [address_, trust] = edge;
            const address = address_.toLowerCase();
            if (!seen.has(address) && trust > Trust.VERIFY) {
                parent.set(address, node)
                if (address === b) {
                    console.log("address is b",parent,a,b)
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
        console.error(e)
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

// Get path of trust between two parties 
export const verifyTrustLocal = async(myAddress: string, addressToTrust: string, signer?: ethers.providers.JsonRpcSigner) => {
    const contract = await ConfideContract(signer);

    const intermediaries = await findTrustedIntermediaries(myAddress, addressToTrust);

    if (intermediaries.length == 0) {
        return false;
    }
    try {
        return await contract.connected(myAddress, addressToTrust, intermediaries);
    } catch (e) {
        console.error(e)
        return false;
    }
}

// Get path of authenticity (5 degrees) between two parties
export const verifyAuthLocal = async(myAddress: string, addressToTrust: string, signer?: ethers.providers.JsonRpcSigner) => {
    const contract = await ConfideContract(signer);

    const path = await findPath(myAddress, addressToTrust);
console.log("path",path)
    if (path.length == 0) {
        return false;
    }
    try {
        return await contract.Connected5Degrees(myAddress, addressToTrust, path);
    } catch (e) {
        console.error(e)

        return false;
    }
}

// Get path of trust between two parties and verify it on-chain
export const verifyTrust = async(myAddress: string, addressToTrust: string, signer?: ethers.providers.JsonRpcSigner) => {
    const contract = await ConfideContract(signer);

    const intermediaries = await findTrustedIntermediaries(myAddress, addressToTrust);

    if (intermediaries.length == 0) {
        return false;
    }
    try {
        const resp = await contract.postConnected(myAddress, addressToTrust, intermediaries);
        return resp.wait().transactionHash;
    } catch (e) {
        console.error(e)
        return false;
    }
}

// Get path of authenticity (5 degrees) between two parties and verify it on-chain
export const verifyAuth = async(myAddress: string, addressToTrust: string, signer?: ethers.providers.JsonRpcSigner) => {
    const contract = await ConfideContract(signer);

    const path = await findPath(myAddress, addressToTrust);
console.log("path",path)
    if (path.length == 0) {
        return false;
    }
    try {
        const resp = await contract.postConnected5Degrees(myAddress, addressToTrust, path.slice(1, path.length - 1));
        return resp.wait().transactionHash;
    } catch (e) {
        console.error(e)

        return false;
    }
}
