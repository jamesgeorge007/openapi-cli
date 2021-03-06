class UniqueParameterNames {
  static get rule() {
    return 'unique-parameter-names';
  }

  constructor(config) {
    this.config = config;
    this.parametersStack = [];
  }

  exitNode(node) {
    if (node.parameters) {
      if (Array.isArray(node.parameters)) {
        node.parameters.forEach(() => this.parametersStack.pop());
      } else if (typeof node.parameters === 'object') {
        Object.keys(node.parameters).forEach(() => this.parametersStack.pop());
      }
    }
  }

  OpenAPIComponents() {
    return {
      onExit: this.exitNode.bind(this),
    };
  }

  OpenAPIOperation() {
    return {
      onExit: this.exitNode.bind(this),
    };
  }

  OpenAPIPath() {
    return {
      onExit: this.exitNode.bind(this),
    };
  }

  OpenAPIParameter() {
    return {
      onEnter: (node, definition, ctx) => {
        let error;
        if (node.name && this.parametersStack.includes(node.name) && !(ctx.pathStack.length === 0 && ctx.path.includes('components'))) {
          ctx.path.push('name');
          error = ctx.createError('Duplicate parameters are not allowed. This name already used on higher or same level.', 'value');
          ctx.path.pop();
        }
        if (node.name) {
          this.parametersStack.push(node.name);
        }
        return error ? [error] : [];
      },
    };
  }
}

module.exports = UniqueParameterNames;
