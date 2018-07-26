const prettier = require('prettier')
const camelcase = require('camelcase')

const defaultPrettierOptions = {
  parser: 'babylon',
  semi: false
}

class Typewriter {
  constructor() {
    this.keypaths = {}
  }

  add(examples, options) {
    options = this._cleanUpOptions(options)
    for (const example of examples) {
      this._traverseExample('', example, options)
    }
    return this._calculateTypeName('', options)
  }

  _traverseExample(keypath, data, options) {
    keypath = this._calculateTypeName(keypath, options) || keypath

    let type = typeof data
    let paths = {}
    if (type === 'object') {
      if (data === null) {
        type = 'null'
      } else if (Array.isArray(data)) {
        type = 'array'
        paths = { '[]': { keypath: keypath + '[]', required: true } }
        data.map(value => this._traverseExample(keypath + '[]', value, options))
      } else {
        Object.keys(data).forEach(
          key =>
            (paths[key] = {
              keypath: this._traverseExample(
                keypath ? keypath + '.' + key : key,
                data[key],
                options
              ),
              required: true
            })
        )
      }
    }
    const current = this.keypaths[keypath] || {}
    const currentKeypath = current[type]
    if (currentKeypath) {
      Object.keys(currentKeypath).forEach(key => {
        if (!paths[key]) {
          currentKeypath[key].required = false
        }
      })
      Object.keys(paths).forEach(key => {
        if (!currentKeypath[key]) {
          currentKeypath[key].required = false
        }
      })
    } else {
      current[type] = paths
    }
    this.keypaths[keypath] = current
    return keypath
  }

  _cleanUpOptions(options) {
    const {
      namedKeyPaths = {},
      typeNameGenerator = Typewriter.defaultTypeNameGenerator,
      rootTypeName
    } = options
    return {
      namedKeyPaths,
      typeNameGenerator,
      rootTypeName
    }
  }

  _calculateTypeName(keypath, options) {
    const { namedKeyPaths, typeNameGenerator, rootTypeName } = options
    const name = namedKeyPaths[keypath] || typeNameGenerator(keypath)
    return keypath === '' ? name || rootTypeName || 'Root' : name
  }

  _typeNames() {
    return Object.keys(this.keypaths).filter(keypath => keypath.indexOf('.') === -1)
  }

  createTypeScript(options = {}) {
    const prettierOptions = { ...options.prettier, ...defaultPrettierOptions }
    const codeForKeyPath = keypath => {
      const keypathValue = this.keypaths[keypath]
      return Object.entries(keypathValue)
        .map(([type, value]) => codeForValue(keypath, type, value))
        .join('|')
    }
    const codeForValue = (keypath, type, value) => {
      if (type === 'array') {
        return `Array<${codeForKeyPath(value['[]'].keypath)}>`
      }
      if (type === 'object') {
        return `{${Object.entries(value)
          .map(([fieldName, fieldValue]) => {
            const required = fieldValue.required ? '' : '?'
            const value =
              fieldValue.keypath.indexOf('.') === -1
                ? fieldValue.keypath
                : codeForKeyPath(fieldValue.keypath)
            return `"${fieldName}"${required}: ${value}`
          })
          .join(',\n')}}`
      }
      if (type === 'function') {
        return '{ (): any }'
      }
      return type
    }
    let code = this._typeNames()
      .map(name => `type ${name} = ${codeForKeyPath(name)}`)
      .join('\n')
    return prettier.format(code, prettierOptions)
  }

  createInlinedTypeScript(rootType, options = {}) {
    const prettierOptions = { ...options.prettier, ...defaultPrettierOptions }
    const codeForKeyPath = keypath => {
      const keypathValue = this.keypaths[keypath]
      return Object.entries(keypathValue)
        .map(([type, value]) => codeForValue(keypath, type, value))
        .join('|')
    }
    const codeForValue = (keypath, type, value) => {
      if (type === 'array') {
        return `Array<${codeForKeyPath(value['[]'].keypath)}>`
      }
      if (type === 'object') {
        return `{${Object.entries(value)
          .map(([fieldName, fieldValue]) => {
            const required = fieldValue.required ? '' : '?'
            const value = codeForKeyPath(fieldValue.keypath)
            return `"${fieldName}"${required}: ${value}`
          })
          .join(',\n')}}`
      }
      if (type === 'function') {
        return '{ (): any }'
      }
      return type
    }
    return this._inlinedVersion(codeForKeyPath(rootType), prettierOptions, 'type Foo =')
  }

  _inlinedVersion(code, prettierOptions, prefix = 'const foo =') {
    let formatted = prettier.format(prefix + code, prettierOptions)
    formatted = formatted.substring(prefix.length).trim()
    if (formatted.endsWith(';')) return formatted.substring(0, formatted.length - 1)
    return formatted
  }
}

Typewriter.defaultTypeNameGenerator = keypath => {
  const name = camelcase((this.prefix + ' ' + key).replace(/\[\]/g, 'Value'))
  return name.substring(0, 1).toUpperCase() + name.substring(1)
}

module.exports = Typewriter
