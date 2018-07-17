const Typewriter = require('./');

const simpleTypes = new Typewriter()
simpleTypes.addDocument({ firstName: 'Marie', lastName: 'Curie' })
simpleTypes.addDocument({ firstName: 'Ada' })

const complexTypes = new Typewriter()
// union types
complexTypes.addDocument({ foo: null })
complexTypes.addDocument({ foo: 'string' })
complexTypes.addDocument({ foo: 1 })
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

complexTypes.addDocument({ bool: true })

test('Simple test for TypeScript', () => {
  expect(simpleTypes.createInlinedTypeScript()).toMatchSnapshot()
  expect(simpleTypes.createTypeScript('ProjectName')).toMatchSnapshot()
});

test('Complex test for TypeScript', () => {
  expect(complexTypes.createInlinedTypeScript()).toMatchSnapshot()
  expect(complexTypes.createTypeScript('ProjectName')).toMatchSnapshot()
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
});
