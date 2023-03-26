const data = [
    "H1",
    "H2",
    "H3",
    "H4",
    "h5"
]

if (data.length > 1) {

    let merkleHashTree = data;
    //loop will run until we get the root hash
    while(merkleHashTree.length != 1) {
        for(let j=0; j<merkleHashTree.length; j+=2){
            if(j+1 < merkleHashTree.length){
                merkleHashTree[j/2] =  merkleHashTree[j] + merkleHashTree[j+1];
            }
            else{
                // if total data is in odd number, here we are adding last data/hash repeat to generate newhash
                merkleHashTree[j/2] =  merkleHashTree[j] + merkleHashTree[j];    
            }
            console.log(merkleHashTree);
        }
        // removing non-essential data from the array
        let n;
        (merkleHashTree.length % 2 == 0) ? n = merkleHashTree.length/2 : n = merkleHashTree.length/2 +1;
        merkleHashTree = merkleHashTree.slice(0,n);
        console.log("stage output:- " + merkleHashTree);
    }
}