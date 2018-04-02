# Validating fetchXml against Schema

Many times we need to work with dynamically generated or user entered fetchXml, In this case it's always a good idea to verify fetcXml against schema before using. This kind of requirement  might come if you are building some awesome stuff like [FetchXML Builder](https://fxb.xrmtoolbox.com/) or [FetchXML to SQL Converter](https://github.com/abtevrythng/FetchXML-to-SQL). or Generating fetchXml query in code.

We need FetchXml schema which can be grabbed from SDK, [MSDN](https://msdn.microsoft.com/en-in/library/gg309405.aspx) or can be found at the end of this article.

Here I'm using a console application.