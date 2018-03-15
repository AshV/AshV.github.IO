# replaceAll() in JavaScript

When we use replace() in any string, most of the times it is not easy to predict how many occurrences we will have to replace. There can be many approaches to do it. Let's have a look at all o them and proceed to the best one.

**1. Use Fail-Safe**

Using more replace() in chain than expected occurrences, this will not harm in anyway but it is not a good practice because no. of occurrence is not predictable.
var StrToRepalce ="Scala is a Functional Programming Language. Scala is easy to learn.";  
  
```javascript  
StrToRepalce = StrToRepalce.replace('Scala', 'F#')  
.replace('Scala', 'F#')  
.replace('Scala', 'F#')  
.replace('Scala', 'F#');  
console.log(StrToRepalce);  
```

**2. split() join() combination**

This approach will work for any number of occurrences, but it is more performance costly.

```javascript
var StrToRepalce ="Scala is a Functional Programming Language. Scala is easy to learn.";  
StrToRepalce = StrToRepalce.split("Scala").join("F#");  
console.log(StrToRepalce);  
```

**3. Using Regular Expression**

Very short and simple. Regex will work for any no. of occurrences, but it is error prone for special characters.
var StrToRepalce ="Scala is a Functional Programming Language. Scala is easy to learn.";  
  
```javascript
StrToRepalce = StrToRepalce.replace(/Scala/g, 'F#');  
  
console.log(StrToRepalce);  
```

**4. RegEx with Special Character handling**

Same as previous approach, but it is capable of handling special characters too.

```javascript
var StrToRepalce ="Scala is a Functional Programming Language. Scala is easy to learn.";  
StrToRepalce = StrToRepalce.replace(new RegExp("Scala".replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g'), "F#");  
console.log(StrToRepalce);  
```

**5. Adding replaceAll() to string prototype to use globally**

The above approaches are all good but it is better to place this function to string prototype so can be run from anywhere across the application.

```javascript
String.prototype.replaceAll = function (find, replace) {  
var str = this;  
return str.replace(new RegExp(find.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g'), replace);  
};  
var StrToRepalce ="Scala is a Functional Programming Language. Scala is easy to learn.";  
StrToRepalce = StrToRepalce.replaceAll("Scala", "F#");  
console.log(StrToRepalce);  
```

Code - https://gist.github.com/AshV/386dfe2a0e1ba22ce29a456d93258e77 

Live Preview - http://codepen.io/AshV/pen/BKaONd
