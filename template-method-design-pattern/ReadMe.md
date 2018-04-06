# Template Method Design Pattern

![template-method-design-pattern](template-method-design-pattern.jpeg)

This pattern falls under behavioral design patterns, as name suggests it defines template which can be used further to create something by using it. You can think it like **stencils**, you can create designs on wall or other surface without much effort, you just to choose color and apply pigment.

Let's understand this with an example. We will be implementing **Logger** which is capable of logging in multiple places like, database, file or sending logs in email. We will start with one simple solution and will refactor it gradually to see how template method pattern can be usefull for us.

### Approach 1 : Create different classes for each type of Logger

We have 3 classes for each type of logger i.e. FileLogger, EmailLogger & DatabaseLogger. All have implemented their own logic.

> Source Code : [Template-Method-Design-Pattern/Logger/Approach1](https://github.com/AshV/Design-Patterns/tree/master/Article-Examples/Template-Method-Design-Pattern/Logger/Approach1)

```csharp
public class FileLogger
{
    public void Log(object message) {
        string messageToLog = SerializeMessage(message);
        OpenFile();
        WriteLogMessage(messageToLog);
        CloseFile();
    }

    private string SerializeMessage(object message) {
        WriteLine("Serializing message");
        return message.ToString();
    }

    private void OpenFile() {
        WriteLine("Opening File.");
    }

    private void WriteLogMessage(string message) {
        WriteLine("Appending Log message to file : " + message);
    }

    private void CloseFile() {
        WriteLine("Close File.");
    }
}

public class EmailLogger
{
    public void Log(object message) {
        string messageToLog = SerializeMessage(message);
        ConnectToMailServer();
        SendLogToEmail(messageToLog);
        DisposeConnection();
    }

    private string SerializeMessage(object message) {
        WriteLine("Serializing message");
        return message.ToString();
    }

    private void ConnectToMailServer() {
        WriteLine("Connecting to mail server and logging in");
    }

    private void SendLogToEmail(string message) {
        WriteLine("Sending Email with Log Message : " + message);
    }

    private void DisposeConnection() {
        WriteLine("Dispose Connection");
    }
}

public class DatabaseLogger
{
    public void Log(string message) {
        string messageToLog = SerializeMessage(message);
        ConnectToDatabase();
        InsertLogMessageToTable(messageToLog);
        CloseDbConnection();
    }

    private string SerializeMessage(object message) {
        WriteLine("Serializing message");
        return message.ToString();
    }

    private void ConnectToDatabase() {
        WriteLine("Connecting to Database.");
    }

    private void InsertLogMessageToTable(string message) {
        WriteLine("Inserting Log Message to DB table : " + message);
    }

    private void CloseDbConnection() {
        WriteLine("Closing DB connection.");
    }
}

class MainClass
{
    static void Main(string[] args) {
        FileLogger fileLogger = new FileLogger();
        fileLogger.Log("Message to Log in File.");
        WriteLine();
        EmailLogger emailLogger = new EmailLogger();
        emailLogger.Log("Message to Log via Email.");
        WriteLine();
        DatabaseLogger databaseLogger = new DatabaseLogger();
        databaseLogger.Log("Message to Log in DB.");
    }
}
```

#### Problem in above Code
 No Code reusability, SerializeMessage() has same implementation in each class.

### Approach 2 : Move duplicate code to common place

We have created class AbstractLogger, and moved common code(i.e. SerializeMessage here) here. All class requiring this code will be inheriting this class now to reuse code.

> Source Code : [Template-Method-Design-Pattern/Logger/Approach2](https://github.com/AshV/Design-Patterns/tree/master/Article-Examples/Template-Method-Design-Pattern/Logger/Approach2)
```csharp
public abstract class AbstractLogger
{
    protected string SerializeMessage(object message) {
        WriteLine("Serializing message");
        return message.ToString();
    }
}

public class FileLogger : AbstractLogger
{
    public void Log(object message) {
        string messageToLog = SerializeMessage(message);
        OpenFile();
        WriteLogMessage(messageToLog);
        CloseFile();
    }

    private void OpenFile() {
        WriteLine("Opening File.");
    }

    private void WriteLogMessage(string message) {
        WriteLine("Appending Log message to file : " + message);
    }

    private void CloseFile() {
        WriteLine("Close File.");
    }
}

public class EmailLogger : AbstractLogger
{
    public void Log(object message) {
        string messageToLog = SerializeMessage(message);
        ConnectToMailServer();
        SendLogToEmail(messageToLog);
        DisposeConnection();
    }

    private void ConnectToMailServer() {
        WriteLine("Connecting to mail server and logging in");
    }

    private void SendLogToEmail(string message) {
        WriteLine("Sending Email with Log Message : " + message);
    }

    private void DisposeConnection() {
        WriteLine("Dispose Connection");
    }
}

public class DatabaseLogger : AbstractLogger
{
    public void Log(string message) {
        string messageToLog = SerializeMessage(message);
        ConnectToDatabase();
        InsertLogMessageToTable(messageToLog);
        CloseDbConnection();
    }

    private void ConnectToDatabase() {
        WriteLine("Connecting to Database.");
    }

    private void InsertLogMessageToTable(string message) {
        WriteLine("Inserting Log Message to DB table : " + message);
    }

    private void CloseDbConnection() {
        WriteLine("Closing DB connection.");
    }
}

class MainClass
{
    static void Main(string[] args) {
        FileLogger fileLogger = new FileLogger();
        fileLogger.Log("Message to Log in File.");
        WriteLine();
        EmailLogger emailLogger = new EmailLogger();
        emailLogger.Log("Message to Log via Email.");
        WriteLine();
        DatabaseLogger databaseLogger = new DatabaseLogger();
        databaseLogger.Log("Message to Log in DB.");
    }
}
```

#### Problem in above Code
All loggers are having 3 kind of operations now, *Opening Connection/File*, *Writing log message* & *Closing/destroying File/object/connection*. So we can assume a typical Logger will always these kind of operation, but still a person who is implementing some new Logger in future has to remember and implement those operation. Shouldn't that be enforced?

Log() is doing nothing fancy, just calling all other method in sequence, isn't it?

### Approach 3 : Enforce user to implement required step, and move responsiblity to call them in base class

> Source Code : [Template-Method-Design-Pattern/Logger/Approach3](https://github.com/AshV/Design-Patterns/tree/master/Article-Examples/Template-Method-Design-Pattern/Logger/Approach3)

```csharp
public abstract class AbstractLogger
{
    protected string SerializeMessage(object message) {
        WriteLine("Serializing message");
        return message.ToString();
    }

    protected abstract void OpenDataStoreOperation();

    protected abstract void LogMessage(string messageToLog);

    protected abstract void CloseDataStoreOpreation();

    public void Log(object message) {
        string messageToLog = SerializeMessage(message);
        OpenDataStoreOperation();
        LogMessage(messageToLog);
        CloseDataStoreOpreation();
    }
}

public class FileLogger : AbstractLogger
{
    protected override void OpenDataStoreOperation() {
        WriteLine("Opening File.");
    }

    protected override void LogMessage(string messageToLog) {
        WriteLine("Appending Log message to file : " + messageToLog);
    }

    protected override void CloseDataStoreOpreation() {
        WriteLine("Close File.");
    }
}

public class EmailLogger : AbstractLogger
{
    protected override void OpenDataStoreOperation() {
        WriteLine("Connecting to mail server and logging in");
    }

    protected override void LogMessage(string messageToLog) {
        WriteLine("Sending Email with Log Message : " + messageToLog);
    }

    protected override void CloseDataStoreOpreation() {
        WriteLine("Dispose Connection");
    }
}

public class DatabaseLogger : AbstractLogger
{
    protected override void OpenDataStoreOperation() {
        WriteLine("Connecting to Database.");
    }

    protected override void LogMessage(string messageToLog) {
        WriteLine("Inserting Log Message to DB table : " + messageToLog);
    }

    protected override void CloseDataStoreOpreation() {
        WriteLine("Closing DB connection.");
    }
}

class MainClass
{
    static void Main(string[] args) {
        FileLogger fileLogger = new FileLogger();
        fileLogger.Log("Message to Log in File.");
        WriteLine();
        EmailLogger emailLogger = new EmailLogger();
        emailLogger.Log("Message to Log via Email.");
        WriteLine();
        DatabaseLogger databaseLogger = new DatabaseLogger();
        databaseLogger.Log("Message to Log in DB.");
    }
}
```

### Approach 4 : Let the Caller decide some of the things

>Source Code : [Template-Method-Design-Pattern/Logger/Approach4](https://github.com/AshV/Design-Patterns/tree/master/Article-Examples/Template-Method-Design-Pattern/Logger/Approach4)
```csharp
public abstract class AbstractLogger
{
    public bool ConsoleLogging { get; set; }

    protected string SerializeMessage(object message) {
        WriteLine("Serializing message");
        return message.ToString();
    }

    protected abstract void OpenDataStoreOperation();

    protected abstract void LogMessage(string messageToLog);

    protected abstract void CloseDataStoreOpreation();

    protected virtual void LogToConsole(string messageToLog) {
        WriteLine("Writing in Console : " + messageToLog);
    }

    public void Log(object message) {
        string messageToLog = SerializeMessage(message);
        OpenDataStoreOperation();
        LogMessage(messageToLog);
        CloseDataStoreOpreation();
        if (ConsoleLogging) {
            LogToConsole(messageToLog);
        }
    }
}

public class FileLogger : AbstractLogger
{
    protected override void OpenDataStoreOperation() {
        WriteLine("Opening File.");
    }

    protected override void LogMessage(string messageToLog) {
        WriteLine("Appending Log message to file : " + messageToLog);
    }

    protected override void CloseDataStoreOpreation() {
        WriteLine("Close File.");
    }
}

public class EmailLogger : AbstractLogger
{
    protected override void OpenDataStoreOperation() {
        WriteLine("Connecting to mail server and logging in");
    }

    protected override void LogMessage(string messageToLog) {
        WriteLine("Sending Email with Log Message : " + messageToLog);
    }

    protected override void CloseDataStoreOpreation() {
        WriteLine("Dispose Connection");
    }
}

public class DatabaseLogger : AbstractLogger
{
    protected override void OpenDataStoreOperation() {
        WriteLine("Connecting to Database.");
    }

    protected override void LogMessage(string messageToLog) {
        WriteLine("Inserting Log Message to DB table : " + messageToLog);
    }

    protected override void CloseDataStoreOpreation() {
        WriteLine("Closing DB connection.");
    }
}

class MainClass
{
    static void Main(string[] args) {
        FileLogger fileLogger = new FileLogger();
        fileLogger.Log("Message to Log in File.");
        WriteLine();
        EmailLogger emailLogger = new EmailLogger();
        emailLogger.ConsoleLogging = true;
        emailLogger.Log("Message to Log via Email.");
        WriteLine();
        DatabaseLogger databaseLogger = new DatabaseLogger();
        databaseLogger.Log("Message to Log in DB.");
    }
}
```