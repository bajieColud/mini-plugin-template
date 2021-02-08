
// Regular Expressions for parsing tags and attributes
var startTag = /^<([-A-Za-z0-9_]+)((?:\s+[a-zA-Z_:][-a-zA-Z0-9_:.]*(?:\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|[^>\s]+))?)*)\s*(\/?)>/,
	endTag = /^<\/([-A-Za-z0-9_]+)[^>]*>/,
	attr = /([a-zA-Z_:][-a-zA-Z0-9_:.]*)(?:\s*=\s*(?:(?:"((?:\\.|[^"])*)")|(?:'((?:\\.|[^'])*)')|([^>\s]+)))?/g;

// Special Elements (can contain anything)
 const isPlainTextElement = makeMap('script,style')

 const isSpecial = makeMap('script,style,template')

const shouldIgnoreFirstNewline = (html) => html[0] === '\n'

function parseHTML(html, handler) {
	var index, chars, match, lastTag ,last = html;

	while (html) {
    chars = true;

		// Make sure we're not in a script or style element
	  if (!isPlainTextElement[lastTag]) {
      if (shouldIgnoreFirstNewline(html)) {
        html = html.substring(1)
        continue;
      }
			// Comment
			if (html.indexOf("<!--") == 0) {
				index = html.indexOf("-->");

				if (index >= 0) {
					if (handler.comment)
						handler.comment(html.substring(4, index));
					html = html.substring(index + 3);
					chars = false;
				}

				// end tag
			} else if (html.indexOf("</") == 0) {
				match = html.match(endTag);

				if (match) {
					html = html.substring(match[0].length);
					match[0].replace(endTag, parseEndTag);
					chars = false;
				}

				// start tag
			} else if (html.indexOf("<") == 0) {
				match = html.match(startTag);

				if (match) {
					html = html.substring(match[0].length);
					match[0].replace(startTag, parseStartTag);
					chars = false;
				}
			}

			if (chars) {
        index = html.indexOf("<");
				var text = ''
				while (index === 0) {
                                  text += "<";
                                  html = html.substring(1);
                                  index = html.indexOf("<");
				}
				text += index < 0 ? html : html.substring(0, index);
				html = index < 0 ? "" : html.substring(index);
       
				if (handler.chars)
					handler.chars(text);
			}

		} else {
			html = html.replace(new RegExp("([\\s\\S]*?)<\/" + lastTag + "[^>]*>"), function (all, text) {
        text = text.replace(/<!--([\s\S]*?)-->|<!\[CDATA\[([\s\S]*?)]]>/g, "$1$2");
			  if (handler.chars)
            handler.chars(text);
        return "";
			});

			parseEndTag("", lastTag);
		}

		if (html == last)
			throw "Parse Error: " + html;
		last = html;
	}

	// Clean up any remaining tags
	parseEndTag();

	function parseStartTag(tag, tagName, rest, unary) {
		tagName = tagName.toLowerCase();
    var attrs = [];
    rest.replace(attr, function (match, name) {
      var value = arguments[2] ? arguments[2] :
        arguments[3] ? arguments[3] :
          arguments[4] ? arguments[4] : ""
          
      attrs.push({
        name: name,
        value: value
      });
    });

    lastTag = tagName;

    unary = !!unary;
    if (handler.start) {
      handler.start(tagName, attrs, unary);
    }

	}

	function parseEndTag(tag, tagName) {
		if (handler.end)
					handler.end(tagName);
  }
};


function makeMap(str) {
	var obj = {}, items = str.split(",");
	for (var i = 0; i < items.length; i++)
		obj[items[i]] = true;
	return obj;
}



function parse (template, options) {
  template = template.trim();
  let stack = []
  let root = {};
  let currentParent
  parseHTML(template, {
    start: function start (tag, attrs, unary) {
      let element = {
        type:1,
        tag,
        attrs,
        unary,
        children:[]
      }
      if (isSpecial[tag]) {
        root[tag] = element;
      }
    
      if (!unary) {
        currentParent = element
        stack.push(element)
      } else {
        element.unary = true
      }
      console.log('####start root tag is ',root);
    },

    end: function end () {
      let element = stack[stack.length - 1]
      if (element) {
        let lastNode = element.children[element.children.length - 1]
        if (lastNode && lastNode.type === 3 && lastNode.text === ' ') {
          element.children.pop()
        }
        // pop stack
        stack.pop()
        currentParent = stack[stack.length - 1]
      }
    },

    chars: function chars (text) {
      let children = currentParent.children;
      let el = {
        type: 3,
        text: text,
        parent: currentParent
      }
      children.push(el)     
      
    },
    comment: function comment (text) {
     
    }
  })
  return root;
}
module.exports = {
  parse
}
