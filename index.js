var checkboxReplace;

checkboxReplace = function(md, options, Token) {
  "use strict";
  var arrayReplaceAt, createTokens, defaults, lastId, pattern, splitTextToken;
  arrayReplaceAt = md.utils.arrayReplaceAt;
  lastId = 0;
  defaults = {
    divWrap: false,
    divClass: 'checkbox',
    idPrefix: 'checkbox'
  };
  options = md.utils.assign(defaults, options);
  pattern = /\[(X|\s|\_|\-)\]\s(.*)/i;
  createTokens = function(checked, label, original, Token) {
    var child, i, id, len, nodes, ref, token;
    nodes = [];

    /**
     * <div class="checkbox">
     */
    if (options.divWrap) {
      token = new Token("checkbox_open", "div", 1);
      token.attrs = [["class", options.divClass]];
      nodes.push(token);
    }

    /**
     * <input type="checkbox" id="checkbox{n}" checked="true">
     */
    id = options.idPrefix + lastId;
    lastId += 1;
    token = new Token("checkbox_input", "input", 0);
    token.attrs = [["type", "checkbox"], ["id", id]];
    if (checked === true) {
      token.attrs.push(["checked", "true"]);
    }
    nodes.push(token);

    /**
     * <label for="checkbox{n}">
     */
    token = new Token("label_open", "label", 1);
    token.attrs = [["for", id]];
    nodes.push(token);

    /**
     * content of label tag
     */
    token = new Token("text", "", 0);
    token.content = label;
    original.children[0].content = label;
    ref = original.children;
    for (i = 0, len = ref.length; i < len; i++) {
      child = ref[i];
      nodes.push(child);
    }

    /**
     * closing tags
     */
    nodes.push(new Token("label_close", "label", -1));
    if (options.divWrap) {
      nodes.push(new Token("checkbox_close", "div", -1));
    }
    original.children = nodes;
    return original;
  };
  splitTextToken = function(original, Token) {
    var checked, first_node, label, matches, text, value;
    if (original.children != null) {
      first_node = original.children[0];
      if (first_node != null) {
        text = first_node.content;
        matches = text.match(pattern);
        if (matches === null) {
          return original;
        }
        checked = false;
        value = matches[1];
        label = matches[2];
        if (value === "X" || value === "x") {
          checked = true;
        }
        return createTokens(checked, label, original, Token);
      }
    }
    return original;
  };
  return function(state) {
    var blockTokens, j, l, token, tokens;
    blockTokens = state.tokens;
    j = 0;
    l = blockTokens.length;
    while (j < l) {
      if (blockTokens[j].type !== "inline") {
        j++;
        continue;
      }
      tokens = blockTokens[j].children;
      token = blockTokens[j];
      arrayReplaceAt(blockTokens, j, splitTextToken(token, state.Token));
      j++;
    }
  };
};


/*global module */

module.exports = function(md, options) {
  "use strict";
  md.core.ruler.push("checkbox", checkboxReplace(md, options));
};
