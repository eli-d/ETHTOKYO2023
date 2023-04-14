import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Confide", function() {
    async function deployConfide() {

        const [owner, a, b, c, d, e, f] = await ethers.getSigners();

        const Confide = await ethers.getContractFactory("Confide");
        const confide = await Confide.deploy();

        return {confide, a, b, c, d, e, f};
    }

    describe("Deployment", function () {
        it("Deploys", async function() {
            await loadFixture(deployConfide);
        })
    });

    describe("Functionality", function () {
        it("Can construct a network", async function() {
            const {confide, a, b, c} = await loadFixture(deployConfide);

            await confide.connect(a).trust(a.address, b.address, 2);
            await confide.connect(b).trust(b.address, c.address, 1);
            await confide.connect(c).trust(c.address, a.address, 1);
            
            expect(await confide.getTrustLevel(a.address, b.address)).to.equal(2);
            expect(await confide.getTrustLevel(b.address, c.address)).to.equal(1);
            expect(await confide.getTrustLevel(c.address, a.address)).to.equal(1);
        })
        it("Can check for full trust connection", async function() {
            const {confide, a, b, c} = await loadFixture(deployConfide);

            await confide.connect(a).trust(a.address, b.address, 2);
            await confide.connect(b).trust(b.address, c.address, 2);

            await confide.connected(a.address, c.address, [b.address]);
        })
        it("Can check for partial trust connection", async function() {
            const {confide, a, b, c, d, e} = await loadFixture(deployConfide);

            await confide.connect(a).trust(a.address, b.address, 1);
            await confide.connect(a).trust(a.address, c.address, 1);
            await confide.connect(a).trust(a.address, d.address, 1);

            await confide.connect(b).trust(b.address, e.address, 2);
            await confide.connect(c).trust(c.address, e.address, 2);
            await confide.connect(d).trust(d.address, e.address, 2);

            await confide.connected(a.address, e.address, [b.address, c.address, d.address]);
        })
    })

    describe("Fail cases", function () {
        it("Won't let users other than the truster update trust", async function() {
            const {confide, a, b, c} = await loadFixture(deployConfide);

            await expect(confide.connect(b).trust(a.address, b.address, 3)).to.be
                .revertedWith('Only the sender can update their trust');
        })
    })
})

