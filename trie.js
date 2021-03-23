
var random = require('string-random')
let CHILDREN_MAX_SIZE = 26;

function create_trie_node(isRoot,value) {
  return {
    isRoot,
    value,
    children:{}
  }
}

function insert_word(rootNode,word,value) {
  let currentNode = rootNode;
  let children;
  for (var i = 0 ;i < word.length;i++) {
    let key = word[i];
    children = currentNode.children;
    if (children[key]) currentNode = children[key] 
    else {
      currentNode = children[key] = create_trie_node(false,i === word.length - 1?value:undefined);
    }
  }
}

function search_word(rootNode,word) {
  let currentNode = rootNode;
  let children;
  for (var i = 0 ;i < word.length;i++) {
    let key = word[i];
    children = currentNode.children;
    if (children[key]){
      currentNode = children[key];
    } 
    else return false;
  }

  return currentNode;
 
}

let ARRAY_SIZE = 100000; //10万个随机字符串

let BUF = [];
let rootNode = create_trie_node(true);

for (var i = 0; i < ARRAY_SIZE;i++) {
    BUF[i] = random(8,{numbers:false})
    insert_word(rootNode,BUF[i],BUF[i])
}

function measureTime(name,fn) {
  const startTime = Date.now()
  fn()
  const endTime = Date.now()
  let medianTime = endTime*1000 -startTime*1000;
  console.log(`${name}: ${medianTime}ns`)
}


function custom_search(word) {
  for (var i = 0; i < BUF.length;i++) {
    if (BUF[i] === word) {
        return i
    }
  }
}

let sword = BUF[BUF.length -1]
console.log(`sword:${sword}`)
measureTime('trie',()=>{
   search_word(rootNode,sword)
  //console.log('###search node is ',node);
})


measureTime('custom-search',()=>{
  custom_search(sword)
})

