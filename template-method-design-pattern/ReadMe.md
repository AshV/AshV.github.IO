# Template Method Design Pattern

![template-method-design-pattern](template-method-design-pattern.jpeg)

This pattern falls under behavioral design patterns, as name suggests it defines template which can be used further to create something out of it. You can think it like **stencils**, after applying pigment to surface you can leave it as it is, or you can further apply designs according to your requirements.

Let's understand this with an example. We will implementing logger which is capable of logging in multiple places like, database, file or sending email. We will start with one simple solution and will graduallys improve it to see how template method pattern can be usefull for us.

## Approach 1

```csharp
public class FileLogger
{
    public void Log(string message) {
        OpenFile();
        WriteLogMessage(message);
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

public class EmailLogger
{
    public void Log(string message) {
        ConnectToMailServer();
        SendLogToEmail(message);
    }

    private void ConnectToMailServer() {
        WriteLine("Connecting to mail server and logging in");
    }

    private void SendLogToEmail(string message) {
        WriteLine("Sending Email with Log Message." + message);
    }
}

public class DatabaseLogger
{
    public void Log(string message) {
        ConnectToDatabase();
        InsertLogMessageToTable(message);
        CloseDbConnection();
    }

    private void ConnectToDatabase() {
        WriteLine("Connecting to Database.");
    }

    private void InsertLogMessageToTable(string message) {
        WriteLine("Inserting Log Message to DB table." + message);
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

## Approach 2

```csharp
public abstract class Logger
{
    protected void LogMessage(string message) {
        WriteLine(message);
    }
}
// Assuming all steps in Logger classes are independent of each other, so moving LogMessage() to parent class

public class FileLogger : Logger
{
    public void Log(string message) {
        OpenFile();
        LogMessage(message);
        CloseFile();
    }

    private void OpenFile() {
        WriteLine("Opening File.");
    }

    private void CloseFile() {
        WriteLine("Close File.");
    }
}

public class EmailLogger : Logger
{
    public void Log(string message) {
        ConnectToMailServer();
        LogMessage(message);
    }

    private void ConnectToMailServer() {
        WriteLine("Connecting to mail server and logging in");
    }
}

public class DatabaseLogger : Logger
{
    public void Log(string message) {
        ConnectToDatabase();
        LogMessage(message);
        CloseDbConnection();
    }

    private void ConnectToDatabase() {
        WriteLine("Connecting to Database.");
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

## Approach 3

```csharp
public abstract class Logger
{
    protected void LogMessage(string message) {
        WriteLine(message);
    }

    protected abstract void OpenConnection();
    protected abstract void CloseConnection();

    public void Log(string message) {
        OpenConnection();
        LogMessage(message);
        CloseConnection();
    }
}

public class FileLogger : Logger
{
    protected override void OpenConnection() {
        WriteLine("Opening File.");
    }

    protected override void CloseConnection() {
        WriteLine("Close File.");
    }
}

public class EmailLogger : Logger
{
    protected override void CloseConnection() {
        WriteLine("Dummy Close");
    }

    protected override void OpenConnection() {
        WriteLine("Connecting to mail server and logging in");
    }
}

public class DatabaseLogger : Logger
{
    protected override void OpenConnection() {
        WriteLine("Connecting to Database.");
    }

    protected override void CloseConnection() {
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