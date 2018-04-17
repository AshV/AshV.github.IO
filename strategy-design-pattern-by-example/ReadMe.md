# Strategy Design Pattern by Example

To accomplish same type of task, different people might follow different strategies/approaches, one strategy could work best for one case whether another could prove best for other scenario.

 Let's take a real world example, In your office building your workstation is on first floor while your colleague has on 7th. Both of you are in hurry to reach their workstation(i.e same task), but if both of you take lift or take stairs(i.e follows same approach) will not be the best strategy. If you take stairs to reach 1st floor and your colleague takes lift to reach 7th floor(i.e different strategies) then this will the best approach by both of you.

 In above scenario you can observe that problem is same but based on other parameters same approach will not prove best in every case. In our day to day code we face similar kind of problem, here **Strategy Design Pattern** comes to rescue, name itself suggests that it's about making strategies, it falls under behavioral design patterns.

### Code Example: JSON Parser

JSON is most popular data exchange format today, suppose there is one system which needs to parse JSON data coming from various sources. This system was working fine, until dev team realized that though all data is in JSON format but there's variety of data like, weather sensor data which has mostly numeric value, blog articles which has large text blocks, chat conversations which has smaller text blocks with emozis. Dev team sees opportunity to optimize the performance of system using different parser according to source of data. Let's see how they addressed the problem and refactored towards maintainable code.

Below is how our initial code looks like.

```csharp
using static System.Console;

class JsonParser {
    private string Source { get; set; }

    private string JsonData { get; set; }

    public JsonParser(string source, string jsonData) {
        Source = source;
        JsonData = jsonData;
    }

    public object Parse() {
        WriteLine("Parsing Json Data");
        // Parsing Logic
        return new { ParsedData = JsonData };
    }
}

class Program {
    static void Main(string[] args) {
        var parsedData = new JsonParser(
            "sensor",
            "{ 'temp' : '38' }")
            .Parse();
    }
}
```

> Example are written in C#, but easily understandable for anyone who knows basic OOPS concept.

### Approach 1

```csharp
using System;
using static System.Console;

class JsonParser {
    private string Source { get; set; }
    private string JsonData { get; set; }

    public JsonParser(string source, string jsonData) {
        Source = source;
        JsonData = jsonData;
    }

    private object ParseSensorData() {
        WriteLine("Parsing Sensor Json Data");
        // Logic optimized for parsing Sensor Data
        return new { ParsedData = JsonData };
    }

    private object ParseBlogData() {
        WriteLine("Parsing Blog Json Data");
        // Logic optimized for parsing Blog Data
        return new { ParsedData = JsonData };
    }


    public object Parse() {
        switch (Source) {
            case "sensor":
                return ParseSensorData();
            case "blog":
                return ParseBlogData();
            default:
                throw new Exception("parser not available for given type.");
        }
    }
}
```
