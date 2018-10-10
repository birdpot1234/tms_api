DateTime diff
=========

Small library that tells the difference between two dates in seconds, minutes, hours and days

## Installation
  ```bash
  $ npm install datetime-diff
  ```

## Usage
```javascript
var diff = require('datetime-diff');
```

## Examples  
```javascript
var diff = require('datetime-diff');
var date1 = new Date(2016, 10, 1);
var date2 = new Date(2016, 10, 2);
var result = diff(date1, date2); // => { "seconds" : 86400, "minutes" : 1440, "hours" : 24, "days" : 1}
console.log(result.days); // => 1
```

## Tests
  ```bash
  $ npm test
  ```

  
