/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
"use strict";

const { ConcatSource } = require("webpack-sources");

/** @typedef {import("../ChunkTemplate")} ChunkTemplate */

const getEntryInfo = chunk => {
	return [chunk.entryModule].filter(Boolean).map(m =>
		[m.id].concat(
			Array.from(chunk.groupsIterable)[0]
				.chunks.filter(c => c !== chunk)
				.map(c => c.id)
		)
	);
};

class JsonpChunkTemplatePlugin {
	/**
	 * @param {ChunkTemplate} chunkTemplate the chunk template
	 * @returns {void}
	 */
	apply(chunkTemplate) {
		chunkTemplate.hooks.render.tap(
			"JsonpChunkTemplatePlugin",
			(modules, chunk) => {
        let name = chunk.name;
        name = name.replace(/[\/@]/g,'_').replace(/[0-9.]/g,'').toUpperCase();
        let source = new ConcatSource();
        source.add(`var ${name} = `)
				source.add(modules);
        source.add(';\n');
        source.add(`export default ${name};`)
			
				return source;
			}
		);
		chunkTemplate.hooks.hash.tap("JsonpChunkTemplatePlugin", hash => {
			hash.update("JsonpChunkTemplatePlugin");
			hash.update("4");
			hash.update(`${chunkTemplate.outputOptions.jsonpFunction}`);
			hash.update(`${chunkTemplate.outputOptions.globalObject}`);
		});
		chunkTemplate.hooks.hashForChunk.tap(
			"JsonpChunkTemplatePlugin",
			(hash, chunk) => {
				hash.update(JSON.stringify(getEntryInfo(chunk)));
				hash.update(JSON.stringify(chunk.getChildIdsByOrders().prefetch) || "");
			}
		);
	}
}
module.exports = JsonpChunkTemplatePlugin;
