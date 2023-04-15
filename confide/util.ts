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
export const ConfideContract = (() => {
    const signer = new ethers.JsonRpcProvider(process.env.CHAIN_URL);
    return new ethers.Contract(CONFIDE_CONTRACT_ADDRESS, CONFIDE_ABI, signer);
})();

export const getTrustedAccounts = async(address: string): Promise<Account[]> => {
    const contract = ConfideContract;
    // TODO authenticity
    return await contract.getEdges(address);
}

// b64
export const createOwnerProof = async(): Promise<string> => {

}

// return address that signed
export const importOwnerProof = async(proof: string): Promise<string> => {

}

// fetch trust
export const lookupAddress = async(myAddress: string, otherAddress: string): Promise<Account> => {
    const contract = ConfideContract;
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
    const contract = ConfideContract;
    await contract.trust(myAddress, addressToTrust, level);
}

export const revokeTrust = async(myAddress: string, addressToTrust: string) => {
    const contract = ConfideContract;
    await contract.trust(myAddress, addressToTrust, Trust.NONE);
}
