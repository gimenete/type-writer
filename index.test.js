const Typewriter = require('./');

const simpleTypes = new Typewriter()
simpleTypes.addDocument({ "first name": 'Marie', "last name": 'Curie' })
simpleTypes.addDocument({ "first name": 'Ada' })

const complexTypes = new Typewriter()
// union types
complexTypes.addDocument({ foo: null })
complexTypes.addDocument({ foo: 'string' })
complexTypes.addDocument({ foo: 1 })
complexTypes.addDocument({ foo: true })
// empty array
complexTypes.addDocument({ foo: [] })
// single array type
complexTypes.addDocument({ bax: ['string'] }) // array with a single value
// union of array types
complexTypes.addDocument({ foo: [1, 2, 3] })
complexTypes.addDocument({ foo: ['a', 'b', 'c'] })
complexTypes.addDocument({ foo: () => {} })
// nested typing, with a common field
complexTypes.addDocument({ foo: { mandatory: true, bar: 'baz' } })
complexTypes.addDocument({ foo: { mandatory: true, hello: 'world' } })
// empty array with no typing information
complexTypes.addDocument({ bar: [] })
// mixed array
complexTypes.addDocument({ mixed: [1, 2, 'a', 'b'] })

// empty object
complexTypes.addDocument({ empty: {} })

test('Simple test for TypeScript', () => {
  expect(simpleTypes.createInlinedTypeScript()).toMatchSnapshot()
  expect(simpleTypes.createTypeScript({ prefix: 'ProjectName', rootTypeName: 'ProjectName' })).toMatchSnapshot()
});

test('Complex test for TypeScript', () => {
  expect(complexTypes.createInlinedTypeScript()).toMatchSnapshot()
  expect(complexTypes.createTypeScript({ prefix: 'ProjectName', rootTypeName: 'ProjectName' })).toMatchSnapshot()
});

test('Union types for root definition for TypeScript', () => {
  const unionRoot = new Typewriter()
  unionRoot.addDocument({ foo: 'bar' })
  unionRoot.addDocument(['c', 'b', 'c'])
  expect(unionRoot.createInlinedTypeScript()).toMatchSnapshot()
  expect(unionRoot.createTypeScript({ prefix: 'ProjectName' })).toMatchSnapshot()
});

test('Simple test for Vue.js validation', () => {
  expect(simpleTypes.createVueValidation()).toMatchSnapshot()
});

test('Complex test for Vue.js validation', () => {
  expect(complexTypes.createVueValidation()).toMatchSnapshot()
});

test('Simple test for PropTypes', () => {
  expect(simpleTypes.createPropTypes('MyComponent.propTypes ')).toMatchSnapshot()
});

test('Complex test for PropTypes', () => {
  expect(complexTypes.createPropTypes('MyComponent.propTypes ')).toMatchSnapshot()
  console.log(JSON.stringify(complexTypes.types, null, 2))
});

test('Empty object for PropTypes', () => {
  const emptyObject = new Typewriter()
  emptyObject.addDocument({})
  expect(emptyObject.createPropTypes('MyComponent.propTypes ')).toMatchSnapshot()
});

test('Named types', () => {
  const namedTypes = new Typewriter()
  namedTypes.addDocument({ payload: { issue: { title: 'Issue titlle' }} }, { 'payload.issue': 'Issue' })
  expect(namedTypes.createTypeScript({ prefix: 'ProjectName', rootTypeName: 'ProjectName' })).toMatchSnapshot()
});

