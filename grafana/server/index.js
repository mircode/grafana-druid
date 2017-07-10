var express = require('express');
var bodyParser = require('body-parser');
var _ = require('lodash');
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

var timeserie = require('./series');

var now = Date.now();

for (var i = timeserie.length -1; i >= 0; i--) {
  var series = timeserie[i];  
  var decreaser = 0;
  for (var y = series.datapoints.length -1; y >= 0; y--) {
    series.datapoints[y][1] = Math.round((now - decreaser) /1000) * 1000;
    decreaser += 50000;
  }
}

var annotation = {
  name : "annotation name",
  enabled: true,
  datasource: "generic datasource",
  showLine: true,
}

var annotations = [
  { annotation: annotation, "title": "Donlad trump is kinda funny", "time": 1450754160000, text: "teeext", tags: "taaags" },
  { annotation: annotation, "title": "Wow he really won", "time": 1450754160000, text: "teeext", tags: "taaags" },
  { annotation: annotation, "title": "When is the next ", "time": 1450754160000, text: "teeext", tags: "taaags" }
];

var now = Date.now();
var decreaser = 0;

for (var i = 0;i < annotations.length; i++) {
  var anon = annotations[i];

  anon.time = (now - decreaser);
  decreaser += 1000000
}

app.all('/', function(req, res) {
  res.send('I have a quest for you!');
  res.end();
});

app.all('/search', function(req, res){
  var result = [];
  _.each(timeserie, function(ts) {
    result.push(ts.target);
  });

  res.json(result);
  res.end();
});

app.all('/annotations', function(req, res) {
  console.log(req.url);
  console.log(req.body);

  res.json(annotations);
  res.end();
})

app.all('/query', function(req, res){
  console.log(req.url);
  console.log(req.body);

  var tsResult = [];

  _.each(req.body.targets, function(target) {
    var k = _.filter(timeserie, function(t) {
      return t.target === target.target;
    });

    _.each(k, function(kk) {
      tsResult.push(kk)
    });
  });

  res.json(tsResult);
  res.end();
});

app.listen(3333);

console.log("Server is listening to port 3333");