import {ConfideContract, Trust} from "./util";

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
        return path.slice(1,path.length-1);
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
            if (!seen.has(address) && trust > Trust.PARTIAL) {
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
                return [{address, trust: Trust.FULL}];
            }
        } else if (trust > 0) {
            if (await contract.getTrustLevel(address, b) > 1) {
                partial.push(address);
            }
        }
        if (partial.length == 3) {
            return partial.map(address => ({address, trust: Trust.PARTIAL}));
        }
    }

    return partial.map(address => ({address, trust: Trust.PARTIAL}));
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
export const verifyTrust = async(myAddress: string, addressToTrust: string, signer?: ethers.JsonRpcSigner) => {
    const contract = await ConfideContract(signer);

    const intermediaries = findTrustedIntermediaries(myAddress, addressToTrust);

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

// Get path of authenticity (5 degrees) between two parties and verify it on-chain
export const verifyAuth = async(myAddress: string, addressToTrust: string, signer?: ethers.JsonRpcSigner) => {
    const contract = await ConfideContract(signer);

    const path = findPath(myAddress, addressToTrust);

    if (path.length == 0) {
        return false;
    }
    try {
        const resp = await contract.postConnected5Degrees(myAddress, addressToTrust, path);
        return resp.wait().transactionHash;
    } catch (e) {
        return false;
    }
}
