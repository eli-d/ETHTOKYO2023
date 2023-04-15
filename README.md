# Confide
Confide is a platform for storing decentralised community trust. It aims to help solve the problem of digital trust and human identification by relying on the most reliable source of trust - human relationships. Using Confide, Web3 users can designate people they know as trusted, creating a web of trust that can be queried to form new networks and test legitimacy.

## Trust and Authenticity

The core concepts underlying Confide are Trust and Authenticity. Authenticity refers to whether an account is owned by a real person - Proof of Personhood. Trust refers to how reliable an account's owner is - are they likely to lie about whether *other* accounts are trustworthy or authentic. A user creates their network by placing trust in accounts that they can validate the owners of, perhaps by a face-to-face meeting such as a hackathon. They can then expand their network through "friends of friends" with features found in the Confide webapp and MetaMask Snap.

## Deployment

- Clone the repo `git clone git@github.com:eli-d/ETHTOKYO2023`.
- Navigate to the metamask snap directory `snap/` and `yarn install` dependencies .
- `yarn start` the snap.
- Start your own local hardhat node `npx hardhat node`.
- Deploy the contract using `contract/scripts/deploy.ts`.
- Open `confide.id` in the browser.
