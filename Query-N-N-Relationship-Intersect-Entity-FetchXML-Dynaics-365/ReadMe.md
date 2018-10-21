# Querying N:N Relationship Intersect Enity with FetchXML in Dynamics 365

In Dynamics 365 most of the times we need to query related data, for 1:N relationships it is very straight forward, but in case of N:N it's little tricky.

For any entity you can simply trigeer **RetrieveMultipleRequest** with **QueryExpression**. or through WebAPI you can query by using plural name of entity but in case of Intersect entity it's not true.

```
ABC
```
