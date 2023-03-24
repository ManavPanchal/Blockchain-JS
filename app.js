const sha256 = require("crypto-js/sha256");
var SHA256 = require("crypto-js/sha256")

function Block(data, previousHash) {
    this.nonce = 0;
    this.timeStamp = new Date().getDate();
    this.data = data;
    this.previousHash = previousHash;

    this.mineBlock = function (securityLevel) {
        while (this.hash.substring(0, securityLevel) !== new Array(securityLevel + 1).join("0")) {
            this.nonce++;
            this.hash = SHA256(this.timeStamp + JSON.stringify(this.data) + this.nonce).toString();
        }
    }

    this.generateHash = function (mine) {
        mine = mine || false;
        this.hash = SHA256(this.timeStamp + JSON.stringify(this.data) + this.nonce).toString();
        if (mine) this.mineBlock(4);
    }
    this.generateHash();

    if (data.length > 1) {
        let merkleTreeSize;
        (data.length % 2 == 0) ? merkleTreeSize = data.length/2 : merkleTreeSize = data.length/2 + 1;

        let merkleHashTree = [];
        for (let i = 0; i <= merkleTreeSize; i++) {
            let tempHashTree = data;
            for(let j=0; j<tempHashTree.length; j+=2){
                if(j+1 < tempHashTree.length){
                    tempHashTree[j/2] = SHA256(SHA256(JSON.stringify(tempHashTree[j])) + SHA256(JSON.stringify(tempHashTree[j+1]))).toString();
                }
                else{
                    tempHashTree[j/2] = SHA256(SHA256(JSON.stringify(tempHashTree[j])) + SHA256(JSON.stringify(tempHashTree[j])));
                }
            }
        }
    }
}

function BlockChain() {

    let genesisBlock = new Block({
        to: "vivek",
        from: "manav",
        currency: "BTC",
        amount: 2
    }, "00000")
    genesisBlock.mineBlock(4);

    this.chain = [genesisBlock];

    this.addBlock = function (data) {
        let previousHash = this.chain[this.chain.length - 1].hash;
        this.chain.push(new Block(data, previousHash));
        this.chain[this.chain.length - 1].mineBlock(4);
    }

    this.isvalid = function () {
        for (let i = 0; i < this.chain.length; i++) {
            let currentBlock = this.chain[i];
            let previousBlock = this.chain[i - 1];

            let hash = currentBlock.hash;
            this.chain[i].generateHash();

            if (currentBlock.hash !== hash) return { msg: "invalid Block! data is changed", blockNo: i, oldHash: hash, newhash: currentBlock.hash };
            if ((i > 0 && currentBlock.previousHash !== previousBlock.hash)) return { msg: "Invalid block, hash of the previous block is changed", blockNo: i };
        }
        return true;
    }
}

let gotuCoin = new BlockChain();

let obj = [
    {
        to: "vedant",
        from: "manav",
        currency: "BTC",
        amount: 3
    },
    {
        to: "manav",
        from: "vivek",
        currency: "BTC",
        amount: 2
    }
]
gotuCoin.addBlock(obj);

console.log(gotuCoin);