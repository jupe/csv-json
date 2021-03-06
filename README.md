csv-json [![Build Status](https://travis-ci.org/jupe/csv-json.png?branch=master)](https://travis-ci.org/jupe/csv-json)
========

[![NPM](https://nodei.co/npm/csv-json.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/csv-json/)

[![NPM](https://nodei.co/npm-dl/csv-json.png)](https://nodei.co/npm/csv-json/)


csv file parser and reorganizer to user defined json object

|version|changes|
|---------|---------|
|0.1.1|keep working with new nodejs and stick with compatible csv|
|0.1.0|possible to put csv direct in string format.  Fix functionality|


Installation
------------
```
npm install csv-json
```

Usage
------------
options parameter can omitted (default settings will be used, eg. csv delimeter is ',')
```
/*
  test.csv:
  ---------
  "HEADER1","HEADER2","HEADER3","HEADER4"
  H1R1,H2R1,H3R1,H4R1
*/
var csvjs = require('../lib/csv-json');
csvjs.parseCsv('./test.csv',
  { rules: {
    { //Rules:
    HEADER1: {path: 'test.h1'},
    HEADER2: {path: 'h2'},
    HEADER3: {path: 'h3'},
    HEADER4: {path: 'test2.h4'}
  }},
  options: { //Options:
    delimiter : ','
  },
  function(error, json, stats){
    /* json:
    [ {
       test: {h1  'H1R0'},
       h2: 'H2R0',
       h3, 'H3R0',
       test2: {h4: 'H4R0'}
      },
      ...
    */
  }
});
```

