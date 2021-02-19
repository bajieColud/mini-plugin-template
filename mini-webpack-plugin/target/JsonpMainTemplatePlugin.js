/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
"use strict";

const { SyncWaterfallHook } = require("tapable");
const Template = require("webpack/lib/Template");

class JsonpMainTemplatePlugin {
	apply(mainTemplate) {
	
		mainTemplate.hooks.render.tap(
			"JsonpMainTemplatePlugin",
			(renderSource, chunk, hash, moduleTemplate, dependencyTemplates) => {
        console.log('####rendersource is ',renderSource)
        return renderSource;
      }
		);
		mainTemplate.hooks.hash.tap("JsonpMainTemplatePlugin", hash => {
			hash.update("jsonp");
			hash.update("6");
		});
	}
}
module.exports = JsonpMainTemplatePlugin;
