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
      console.log('####element is ',element)
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
    if (node.unary) {
      return `<${tag} ${attrs} />`
    }
    return `<${tag} ${attrs}>${childrenContent}</${tag}>`

  }else if (type === 3) {
    return node.text;
  }
 
}


module.exports = function(ast,{platform}) {
  platform = platform || 'wx';
  handleAst(ast,platform);
  let code = generateCode(ast)
  console.log('##code is ',code);
  code = code.replace(/\s*<template\s+>([\s\S]*)<\/template\s*>/,function($0,$1){
    console.log('##s1 is ',$1)
    return $1;
  })

  return code;
}