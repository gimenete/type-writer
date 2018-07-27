const Typewriter = require('./')

describe('Simple types', () => {
  const simpleTypes = new Typewriter()
  simpleTypes.add([{ 'first name': 'Marie', 'last name': 'Curie' }, { 'first name': 'Ada' }])

  test('Simple test for TypeScript', () => {
    expect(simpleTypes.generate('typescript', { inlined: true })).toMatchSnapshot()
    expect(simpleTypes.generate('typescript')).toMatchSnapshot()
  })

  test('Simple test for PropTypes', () => {
    expect(simpleTypes.generate('propTypes', { inlined: true })).toMatchSnapshot()
    expect(simpleTypes.generate('propTypes')).toMatchSnapshot()
  })
})

describe('Complex types', () => {
  const complexTypesExamples = []
  // union types
  complexTypesExamples.push({ foo: null })
  complexTypesExamples.push({ foo: 'string' })
  complexTypesExamples.push({ foo: 1 })
  complexTypesExamples.push({ foo: true })
  // empty array
  complexTypesExamples.push({ foo: [] })
  // single array type
  complexTypesExamples.push({ bax: ['string'] }) // array with a single value
  // union of array types
  complexTypesExamples.push({ foo: [1, 2, 3] })
  complexTypesExamples.push({ foo: ['a', 'b', 'c'] })
  complexTypesExamples.push({ foo: () => {} })
  // nested typing, with a common field
  complexTypesExamples.push({ foo: { mandatory: true, bar: 'baz' } })
  complexTypesExamples.push({ foo: { mandatory: true, hello: 'world' } })
  // empty array with no typing information
  complexTypesExamples.push({ bar: [] })
  // mixed array
  complexTypesExamples.push({ mixed: [1, 2, 'a', 'b'] })

  // empty object
  complexTypesExamples.push({ empty: {} })

  const complexTypes = new Typewriter()
  complexTypes.add(complexTypesExamples)

  test('Complex test for TypeScript', () => {
    expect(complexTypes.generate('typescript', { inlined: true })).toMatchSnapshot()
    expect(complexTypes.generate('typescript')).toMatchSnapshot()
  })

  test('Union types for root definition for TypeScript', () => {
    const unionRoot = new Typewriter()
    unionRoot.add([{ foo: 'bar' }, ['c', 'b', 'c']])
    expect(unionRoot.generate('typescript', { inlined: true })).toMatchSnapshot()
    expect(unionRoot.generate('typescript')).toMatchSnapshot()
  })

  test('Complex test for PropTypes', () => {
    expect(complexTypes.generate('propTypes', { inlined: true })).toMatchSnapshot()
    expect(complexTypes.generate('propTypes')).toMatchSnapshot()
  })
})
