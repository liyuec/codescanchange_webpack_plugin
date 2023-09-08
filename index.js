
class codescanchange_webpack_plugin{
    /*
        {
            distFileName:'文件名，例如chunk-vendors',
            targetCode:'',
            replaceCode:''
        }
    */
    constructor(options){
        if(options.constructor !== Object){
            throw new Error('must be a Object');
        }
        this.$options = options || {};
        
    }

    apply(compiler){
        let _compiler = compiler;

        compiler.hooks.afterEmit.tap("codescanchange_webpack_plugin", (compilation) => {
            debugger;
            let _compilation = compilation,
            _assets = _compilation.assets,
            _buffer = '',
            _replaceStr = '',
            codeSpanObj = {},
            _fileNames = [],
            _ops = this.$options;

            _fileNames = Object.keys(_compilation.assets);

            for(let i = 0;i<_fileNames.length;i++){
                let _fileName = _fileNames[i],
                _suffix = _fileName.split('.');

                _suffix = _suffix[_suffix.length - 1];

                if(_fileName.indexOf(_ops.distFileName) > -1 && _suffix !== 'map' && _suffix !== '.css'){
                    let _filePath = _compilation.assets[_fileName].existsAt;
                    _buffer = _compiler.inputFileSystem.readFileSync(_filePath);
                    _replaceStr = _buffer.toString();
                    //_replaceStr = _replaceStr.replace('this.hoverTimer=setTimeout',`window.macetest='mace_test';this.hoverTimer=setTimeout`)
                    
                    _replaceStr = _replaceStr.replace(new RegExp(_ops.targetCode, 'g'), _ops.replaceCode);
                    _compiler.outputFileSystem.writeFile(_filePath,_replaceStr,function(){}); 
                }
            }

		});

       
           
    }
}

module.exports = codescanchange_webpack_plugin;