var exec = require('child_process').exec;
fs = require('fs'),

    function randomString() {
        var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
        var string_length = 8;
        var randomstring = '';
        for (var i=0; i<string_length; i++) {
            var rnum = Math.floor(Math.random() * chars.length);
            randomstring += chars.substring(rnum,rnum+1);
        }
        return randomstring;
    }

var tesseract = {
    process: function process( image, callback ) {
        var pipe_name = randomString();
        var tesseract_output;

        exec("mkfifo " + pipe_name + '.txt', function mkfifo (err, stdout, stderr){
            call_tesseract(arguments);
        });

        function call_tesseract() {

            tesseract_output = fs.createReadStream(pipe_name + '.txt');

            tesseract_output.on('data', function(data){
                fs.unlink(pipe_name + '.txt', function (err) {
                    if (err) throw err;
                });
                callback(null, data.toString('ascii'));
            });

            exec("tesseract -l eng " + image + " " + pipe_name, function(err, stdout, stderr){

            });
        }
    }
}

module.exports.process = tesseract.process;
