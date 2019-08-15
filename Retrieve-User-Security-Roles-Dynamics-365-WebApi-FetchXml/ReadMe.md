

```xml
<fetch>
  <entity name="systemuser">
    <attribute name="systemuserid" />
    <link-entity name="systemuserroles" from="systemuserid" to="systemuserid" intersect="true">
     <all-attributes/>

 <link-entity name="role" from="roleid" to="roleid" visible="false" link-type="outer" alias="a_410707b195544cd984376608b1802904">
      <attribute name="name" />
    </link-entity>

    </link-entity>
  </entity>
</fetch>
```