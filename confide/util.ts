import {ethers} from "ethers";
import CONFIDE_ABI from "./Confide.json";

export enum Trust {
    NONE,
    PARTIAL,
    FULL,
    FULLER
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

export const CONFIDE_CONTRACT_ADDRESS = "0x0B306BF915C4d645ff596e518fAf3F9669b97016";
export const ConfideContract = (async() => {
    const provider = new ethers.JsonRpcProvider();
    const signer = await provider.getSigner();
    return new ethers.Contract(CONFIDE_CONTRACT_ADDRESS, CONFIDE_ABI, signer);
})();

export const getTrustedAccounts = async(address: string): Promise<Account[]> => {
    const contract = await ConfideContract;
    const edges: Array<[address: string, trust: Trust]> = await contract.getEdges(address);
    // TODO authenticity
    return edges.map(([address, trust]) => ({address, trust, authenticity: Authenticity.NONE}))
}

// b64
export const createOwnerProof = async(myAddress: string, otherAddress: string): Promise<string> => {
    // sign a message with my account containing their address (and a nonce? time specific?)
    const provider = new ethers.JsonRpcProvider();
    const signer = await provider.getSigner();
    return await signer.signMessage(otherAddress);
}

// return address that signed or null if incorrect
export const importOwnerProof = async(proof: string, expectedSigner: string, myAddress: string): Promise<string | null> => {
    const msg = myAddress; 
    const verifiedAddress = ethers.verifyMessage(msg, proof);
    if (verifiedAddress !== expectedSigner)
        return null;
    return verifiedAddress;
}

// fetch trust
export const lookupAddress = async(myAddress: string, otherAddress: string): Promise<Account> => {
    const contract = await ConfideContract;
    // TODO authenticity
    const trust = await contract.getTrustLevel(myAddress, otherAddress);
    return {
        address: otherAddress,
        trust: trust,
        // TODO authenticity
        authenticity: Authenticity.NONE
    }
}

export const trustAddress = async(myAddress: string, addressToTrust: string, level: Trust) => {
    const contract = await ConfideContract;
    await contract.trust(myAddress, addressToTrust, level);
}

export const revokeTrust = async(myAddress: string, addressToTrust: string) => {
    const contract = await ConfideContract;
    await contract.trust(myAddress, addressToTrust, Trust.NONE);
}