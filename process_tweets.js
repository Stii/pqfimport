var https = require('https')
var mg = require('mongoose');

mg.connect('mongodb://localhost/pqf');

var tweetSchema = mg.Schema({
    number: Number,
    html: String,
    tweetid: {type: String, index: true},
    name: String,
    link: String,
    handle: {type: String, index: true},
    tags: [] 
});

var tweet = mg.model('Tweet', tweetSchema);

var taglistSchema = mg.Schema({
    tag: {type: String, index: {unique: true, dropDups: true}}
});

var tag = mg.model('Tag', taglistSchema);

var pplSchema = mg.Schema({
    person: {type: String, index: {unique: true, dropDups: true}}
});

var ppl = mg.model('People', pplSchema);

var tid = process.argv[2];
var tag_str = process.argv[3];
var tag_arr = tag_str.split(',');
var handle = process.argv[4];
var rowid = 0;
tweet.count({}, function(err, count) {
    rowid = count + 1;
    return rowid;
});

https.get("https://api.twitter.com/1/statuses/oembed.json?id=" + tid, function(res) {
  console.log("Got response: " + res.statusCode);
  res.on('data', function(chunk) {
      tstr = '' + chunk;
      jstr = JSON.parse(tstr);
      var data = {number: rowid, html: jstr.html, tweetid: tid, name: jstr.author_name, link: jstr.author_url, tags: tag_arr, handle: handle}
      twt = new tweet(data)
      twt.save()
      for (var i = 0; i < tag_arr.length; i++) {
        tg = new tag({tag: tag_arr[i]})
        tg.save()
      }
      person = new ppl({person: handle});
      person.save()
  });
}).on('error', function(e) {
  console.log("Got error: " + e.message);
});
/*
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
*/
