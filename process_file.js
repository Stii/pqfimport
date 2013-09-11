var fs = require('fs');
var mg = require('mongoose');

mg.connect('mongodb://localhost/pqf');

var qtSchema = mg.Schema({
    quote: String,
    source: String,
    number: Number 
});

var pqf = mg.model('Pqf', qtSchema);

var input = fs.readFileSync('pqf.txt').toString();

var stringyfy = input.replace(/\n/g, '|');
var arr = stringyfy.split(/\|\|\|/);
var counter = 1;
arr.forEach(function(entry) {
    //TODO: split the book into its own field.
    var quote_blob =  entry.replace(/\|/g, '\n');
    var quote_arr = quote_blob.split('--');
    var data = { quote: quote_arr[0], number: counter, source: quote_arr[1]}
    console.log(data);
    var qt = new pqf(data); 
    qt.save();
    counter++;
});
