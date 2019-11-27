

### Customize icons

All icons used are rendered by the same `SMU.renderIcon` function. You can replace it with your custom logic. 
```typescript
// The default 
SMU.renderIcon = function(icon, data= {})  {
    data.class                    = data.class || {};
    data.class[ 'fa fa-' + icon ] = true;
    return SMU.h('i', data);
}
```