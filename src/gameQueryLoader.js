export default function gameQueryLoader(content, sourceMap) {
    const callback = this.async();

    let importsCode = '/*** IMPORTS FROM gameQueryLoader ***/\n';

    importsCode += '\nvar jQuery = require(\'jquery\');\n';

    if (this.sourceMap && sourceMap) {
        const node = SourceNode.fromStringWithSourceMap(
            content,
            new SourceMapConsumer(sourceMap)
        );

        node.prepend(`${importsCode}\n`);

        const result = node.toStringWithSourceMap({ file: this.resourcePath });

        callback(null, result.code, result.map.toJSON());

        return;
    }

    callback(null, `${importsCode}\n${content}`, sourceMap);
}
