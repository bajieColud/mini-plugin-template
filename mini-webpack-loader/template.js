var attrList = {
  "wx":{
    "s:if":"wx:if",
    "s:for":"wx:for",
    "s:else":"wx:else",
    "s:for-item":"wx:for-item",
    "s:for-key":"wx:for-key",
    "s:key":"wx:key",
    "s:elif":"wx:elif",
  }

}

function convertAttrs(attrs,platform) {
  if (!attrs) return;
   let attrMap = attrList[platform]
   attrs.forEach((attr)=>{
      let key = attr.name;
      if (attrMap[key]){
        attr.name = attrMap[key]
      }
      attr.value = attr.value.replace(/\"/g,'\'')
   })
}

function handleAst(node,platform){
  let children = node.children;
  if (children && children.length) {
    children.forEach(element => {
      console.log('###element is ',element)
        handleAst(element,platform)
    });
  }
  convertAttrs(node.attrs,platform)
}

function generateCode(node) {
  let children = node.children || [];
  const childrenContent = children.map(childAst => generateCode(childAst)).join('')
  let attrs = node.attrs || [];
    attrs = attrs.map((item)=>{
    return `${item.name}="${item.value}"`
  }).join(' ')
  attrs = attrs ? ` ${attrs}` : ''
let type = node.type;
  if (type === 1) {
    let tag = node.tag
    if (node.closed) {
      return `<${tag}${attrs} />`
    }
    return `<${tag}${attrs}>${childrenContent}</${tag}>`

  }else if (type === 2) {
    return node.text;
  }
 
}


module.exports = function(ast,{platform}) {
  platform = platform || 'wx';
  handleAst(ast,platform);
  let code = generateCode(ast)
  console.log('###code is ',code,ast)
  let temp = '<template>'
  let first = code.indexOf(temp);
  let last = code.lastIndexOf('</template>');
  return code.substring(first+temp.length,last)
}