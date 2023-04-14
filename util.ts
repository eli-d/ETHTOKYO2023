enum Trust {
    // could be nice to have PARTIAL_ONE/PARTIAL_TWO
    // for UX on how trusted an account is
    // alt: just have PARTIAL
    PARTIAL_ONE,
    PARTIAL_TWO,
    FULL
};

type Account = {
    address: string;
    trust: Trust;    
}

export const getAccounts = async(): Promise<Account[]> => {

}

// b64
export const createOwnerProof = async(): Promise<string> => {

}

// return address that signed
export const importOwnerProof = async(proof: string): Promise<string> => {

}

// fetch trust
export const lookupAddress = async(address: string): Promise<Account> => {
    return {
        address,
        trust: Trust.NONE
    }
}

export const trustAddress = async(address: string) => {

}

export const revokeTrust = async(address: string) => {

}
