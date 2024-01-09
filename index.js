const webpackVersion = require('webpack/package.json').version;

class codescanchange_webpack_plugin{
    /*
        [
            {
                distFileName:'文件名，例如chunk-vendors',
                targetCode:'',
                replaceCode:''
            }
        ]
    */
    constructor(isgo,options){
        if(options.constructor !== Array){
            throw new Error('must be a Array');
        }
        this.$isGo = isgo;
        this.$options = options || [];
        console.log(`Webpack version: ${webpackVersion}`);
        this.$options.webpackVersion = [...webpackVersion][0]
    }

    apply(compiler){
        if(!this.$isGo){
            return
        }
        let _compiler = compiler;

        if(this.$options.webpackVersion === '4'){
            compiler.hooks.afterEmit.tap("codescanchange_webpack_plugin", (compilation) => {
                let _compilation = compilation,
                _assets = _compilation.assets,
                _buffer = '',
                _replaceStr = '',
                codeSpanObj = {},
                _fileNames = [],
                _ops = this.$options,
                _isEnd = true;

                _fileNames = Object.keys(_compilation.assets);

                //多条件匹配
                for(let n = 0;n<_ops.length;n++){
                        
                        for(let i = 0;i<_fileNames.length;i++){
                            let _fileName = _fileNames[i],
                            _suffix = _fileName.split('.');
        
                            _suffix = _suffix[_suffix.length - 1];
        
                          
                            if(_fileName.indexOf(_ops[n].distFileName) > -1){
                                if(_suffix === 'js'){
                            
                                    let _filePath = _compilation.assets[_fileName].existsAt;
                                    if(!_filePath){
                                        _filePath = _compiler.options.context + '/' + _fileName
                                        _filePath = _filePath.replace(new RegExp('/', 'g'), '\\')
                                    }
                                    _buffer = _compiler.inputFileSystem.readFileSync(_filePath);
                                    _replaceStr = _buffer.toString();

                                    for(let tcodeInx = 0;tcodeInx < _ops[n].targetCode.length;tcodeInx++){
                                        _isEnd = true;
                                        while(_isEnd){
                                            if(_replaceStr.indexOf(_ops[n].targetCode[tcodeInx]) < 0){
                                                _isEnd = false;
                                            }else{
                                                _replaceStr = _replaceStr.replace(_ops[n].targetCode[tcodeInx], _ops[n].replaceCode[tcodeInx]);
                                            }
                                            //_replaceStr = _replaceStr.replace(new RegExp(_ops.targetCode, 'g'), _ops.replaceCode);
                                        }
                                    }
                                    _compiler.outputFileSystem.writeFile(_filePath,_replaceStr,function(){}); 
        
                                }
                            }
                        }
                }
               
            }); 
        }else if(this.$options.webpackVersion === '5'){
            compiler.hooks.assetEmitted.tap("codescanchange_webpack_plugin", (file, { content, source, outputPath, compilation, targetPath }) => {
            
                let _compilation = compilation,
                _buffer = '',
                _replaceStr = '',
                codeSpanObj = {},
                _fileNames = [],
                _ops = this.$options,
                _suffix = '',
                _targetPath = !!targetPath ? targetPath : file,
                _isEnd = true;
    
                //webpack4+,webpack5+ hack
                _suffix = _targetPath.split('.');
                _suffix = _suffix[_suffix.length - 1];
    
                for(let n = 0;n<_ops.length;n++){
                    if(_targetPath.indexOf(_ops[n].distFileName) > -1){
                        if(_suffix === 'js'){
                            let _filePath = _targetPath;
                            /* if(!_filePath){
                                _filePath = _compiler.options.context + '/' + _fileName
                                _filePath = _filePath.replace(new RegExp('/', 'g'), '\\')
                            } */
                            _buffer = _compiler.inputFileSystem.readFileSync(_filePath);
                            _replaceStr = _buffer.toString();
                            //_replaceStr = _replaceStr.replace(new RegExp(_ops.targetCode, 'g'), _ops.replaceCode);
                            //_replaceStr = _replaceStr.replace(/_ops.targetCode/g, _ops.replaceCode);

                            for(let tcodeInx = 0;tcodeInx < _ops[n].targetCode.length;tcodeInx++){
                                _isEnd = true;
                                while(_isEnd){
                                    if(_replaceStr.indexOf(_ops[n].targetCode[tcodeInx]) < 0){
                                        _isEnd = false;
                                    }else{
                                        _replaceStr = _replaceStr.replace(_ops[n].targetCode[tcodeInx], _ops[n].replaceCode[tcodeInx]);
                                    }
                                
                                }
                            }
                            //_replaceStr = 'console.log(1234567890);' + _replaceStr;
                            _compiler.outputFileSystem.writeFile(_filePath,_replaceStr,function(){}); 
        
                        }
                    }
                }

    
            })
        }
          

     
       
           
    }
}

module.exports = codescanchange_webpack_plugin;