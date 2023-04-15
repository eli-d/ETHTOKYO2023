import {ethers} from "ethers";
import CONFIDE_ABI from "./Confide.json";

enum Trust {
    NONE,
    // could be nice to have PARTIAL_ONE/PARTIAL_TWO
    // for UX on how trusted an account is
    // alt: just have PARTIAL
    PARTIAL_ONE,
    PARTIAL_TWO,
    FULL,
};

enum Authenticity {
    NONE,
    AUTHENTIC
};

type Account = {
    address: string;
    trust: Trust;    
    authenticity: Authenticity;
}

export const CONFIDE_CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
export const ConfideContract = (async () => {
    const provider = new ethers.JsonRpcProvider('http://localhost:8545');
    const signer = await provider.getSigner();
    return new ethers.Contract(CONFIDE_CONTRACT_ADDRESS, CONFIDE_ABI, signer);
})();


export const backtrace = async(parent, a: string, b: string) => {
    let path = [b];
    while (path[-1] != a) {
        path.push(parent[b]);
    }
    return path.reverse();
}

export const findPath = async(a: string, b: string) => {
    const contract = await ConfideContract;

    let seen = new Set();
    
    let q: string[] = Array<string>();
    q.push(a);

    let parent = new Map<string, string>();

    while(q.length > 0) {
        const node = q.shift();

        if (node == b) {
            return backtrace(parent, a, b);
        }

        const edges = await contract.getEdges(node);

        for (let edge of edges) {
            if (!seen.has(edge._address)) {
                parent[edge._address] = node;

                q.push(edge._address);
                seen.add(edge._address);
            }
        }
    }
    return []
};

export const findTrustIntermediaries = async(a: string, b: string) => {
    const contract = await ConfideContract;

    const edges = await contract.getEdges(a);

    let full: string[] = Array<string>();
    let partial: string[] = Array<string>();

    for (let edge of edges) {
        const {_address: address, trustLevel: trust} = edge;
        if (trust > 1) {
            if (await contract.getTrustLevel(address, b) > 1) {
                return [address];
            }
        } else if (trust > 0) {
            if (await contract.getTrustLEvel(address, b) > 1) {
                partial.push(address);
            }
        }
        if (partial.length == 3) {
            return partial;
        }
    }

    return partial;
}
