# typewriter

Generate type definitions for TypeScript, Flow, PropTypes, etc. by using examples of the data

## Example

```javascript
const tw = new TypeWriter()
tw.addDocument({ foo: 'bar' })
tw.addDocument({ foo: 1 })
tw.addDocument({ foo: [1, 2, 3] })
console.log('# Inlined TypeScript')
console.log(tw.createInlinedTypeScript())
console.log()
console.log('# TypeScript')
console.log(tw.createTypeScript('Project'))
console.log()
console.log('# Vue.js validation')
console.log(tw.createVueValidation())
console.log()
console.log('# PropTypes')
console.log(tw.createPropTypes('MyComponent.propTypes'))
console.log()
```

Output:

```
# Inlined TypeScript
{
  foo: string | number | Array<number>
}

# TypeScript
interface IProject {
  foo: string | number | Array<number>;
}

export type Project = IProject


# Vue.js validation
{
  foo: [
    { type: String, required: true },
    { type: Number, required: true },
    { type: Array, required: true }
  ]
}


# PropTypes
MyComponent.propTypes = {
  foo: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.arrayOf(PropTypes.number)
  ]).isRequired
}
```
