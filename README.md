csv-json
========

csv file parser and reorganizer to user defined json object


Usage
------------
options parameter can be null, default csv delimeter is ','
```
/*
  test.csv:
  ---------
  "HEADER1","HEADER2","HEADER3","HEADER4"
  H1R1,H2R1,H3R1,H4R1
*/
var csvjs = require('../lib/csv-json');
csvjs.parseCsv('./test.csv',
  { //Rules:
    HEADER1: {path: 'test.h1'},
    HEADER2: {path: 'h2'},
    HEADER3: {path: 'h3'},
    HEADER4: {path: 'test2.h4'}
  },
  { delimiter : ',' }, 
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

Installation
------------
  $ npm install csv-json
