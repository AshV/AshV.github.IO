# Linq.js for Dynamics 365 Developers

Recently I was working in some large JSON objects in client side javascript where I had to query through it several times as per requirement I was using [javascript array's functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/prototype). Then I thought why not use [lodash.js](https://github.com/lodash/lodash/) or [underscore.js](https://github.com/jashkenas/underscore) I checked over github they are really feature rich and trustworthy, but there was a whole new list of functions and syntax to learn.

Then after few more google search I got sevearal [javascript libraries with LINQ like syntax](https://dzone.com/articles/5-linq-javascript-libraries), after comparing I found [linq.js](https://github.com/mihaifm/linq) most promising and even size is lesser when comparing to lodash and underscore.

Library     | GZipped size 
----------  | ------------
lodash      | ~ 24 KB 
**linq.js** | **~ 7 KB** 
underscore  | ~ 6.6 KB

> linq.js github project link -> [https://github.com/mihaifm/linq](https://github.com/mihaifm/linq)

With Linq.js dynamics 365 developers can use their existing knowledge of LINQ in javascript code whith nominal changes. see below examples from their github 

```js
// C# LINQ - delegate
Enumerable.Range(1, 10)
    .Where(delegate(int i) { return i % 3 == 0; })
    .Select(delegate(int i) { return i * 10; });

// linq.js - anonymous function
Enumerable.range(1, 10)
    .where(function(i) { return i % 3 == 0; })
    .select(function(i) { return i * 10; });
```

```js
// C# LINQ - lambda
Enumerable.Range(1, 10).Where(i => i % 3 == 0).Select(i => i * 10);

// linq.js - arrow function
Enumerable.range(1, 10).where(i => i % 3 == 0).select(i => i * 10);
```

```js
// C# LINQ - anonymous type
array.Select((val, i) => new { Value = val, Index = i });

// linq.js - object literal
Enumerable.from(array).select((val, i) => ({ value: val, index: i}));
```