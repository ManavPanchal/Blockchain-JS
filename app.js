var SHA256 = require("crypto-js/sha256")

function Block(data, previousHash) {
    this.nonce = 0;
    let tempdate = new Date().getDate();
    this.timeStamp = tempdate;
    this.data = data;
    this.previousHash = previousHash;
    this.merkleTree;
    this.hash;

    this.mineBlock = function (securityLevel) {
        this.nonce = 0;
        let merkleRoot = "";
        if (this.data.length > 1) {
            // if you want to understand how this merkle tree structure work you can see by executing merkletree.js
            let merkleHashTree = this.data;
            while(merkleHashTree.length != 1) {
                for(let j=0; j<merkleHashTree.length; j+=2){
                    if(j+1 < merkleHashTree.length){
                        merkleHashTree[j/2] =  SHA256(SHA256(JSON.stringify(merkleHashTree[j])).toString + SHA256(JSON.stringify(merkleHashTree[j+1])).toString()).toString();
                    }
                    else{
                        merkleHashTree[j/2] =  SHA256(SHA256(JSON.stringify(merkleHashTree[j]).toString()) + SHA256(JSON.stringify(merkleHashTree[j])).toString()).toString();
                    }
                }
                let n;
                (merkleHashTree.length % 2 == 0) ? n = merkleHashTree.length/2 : n = merkleHashTree.length/2 +1;
                merkleHashTree = merkleHashTree.slice(0,n);
            }
            merkleRoot = merkleHashTree[0].toString();
        }

        (merkleRoot != "") ? this.hash = merkleRoot : this.hash = SHA256(JSON.stringify(this.data)).toString();
        
        while (this.hash.substring(0, securityLevel) !== new Array(securityLevel + 1).join("0")) {
            this.nonce++;
            this.hash = SHA256(this.timeStamp + this.hash + this.nonce).toString();
        }
    }
}

function BlockChain() {

    let genesisBlock = new Block({
        to: "vivek",
        from: "manav",
        currency: "BTC",
        amount: 2
    }, "0000000000000000000000000000000000000000000000000000000000000000")
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
            currentBlock.mineBlock(4);
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
        from: "vedant",
        currency: "BTC",
        amount: 2
    }
]
gotuCoin.addBlock(obj);
gotuCoin.chain[1].data = [{
    name: "manav"
}]
gotuCoin.chain[0].mineBlock(4);
console.log(gotuCoin.isvalid());