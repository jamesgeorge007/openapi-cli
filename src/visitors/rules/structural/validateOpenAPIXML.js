/* eslint-disable class-methods-use-this */
import { createErrrorFieldTypeMismatch } from '../../../error';

import isRuleEnabled from '../../utils';
import AbstractVisitor from '../../utils/AbstractVisitor';

class ValidateOpenAPIXML extends AbstractVisitor {
  static get ruleName() {
    return 'xml';
  }

  validators() {
    return {
      name: (node, ctx) => {
        if (node && node.name && typeof node.name !== 'string') return createErrrorFieldTypeMismatch('string', node, ctx, { fromRule: this.rule, severity: this.config.level });
        return null;
      },
      namespace: (node, ctx) => {
        // TODO: add validation that format is uri
        if (node && node.namespace && typeof node.namespace !== 'string') return createErrrorFieldTypeMismatch('string', node, ctx, { fromRule: this.rule, severity: this.config.level });
        return null;
      },
      prefix: (node, ctx) => {
        if (node && node.prefix && typeof node.prefix !== 'string') return createErrrorFieldTypeMismatch('string', node, ctx, { fromRule: this.rule, severity: this.config.level });
        return null;
      },
      attribute: (node, ctx) => {
        if (node && node.attribute && typeof node.attribute !== 'boolean') return createErrrorFieldTypeMismatch('boolean', node, ctx, { fromRule: this.rule, severity: this.config.level });
        return null;
      },
      wrapped: (node, ctx) => {
        if (node && node.wrapped && typeof node.wrapped !== 'boolean') return createErrrorFieldTypeMismatch('boolean', node, ctx, { fromRule: this.rule, severity: this.config.level });
        return null;
      },
    };
  }

  OpenAPIXML() {
    return {
      onEnter: (node, definition, ctx) => {
        const result = [];
        const validators = this.validators();
        const vals = Object.keys(validators);
        for (let i = 0; i < vals.length; i += 1) {
          if (isRuleEnabled(this, vals[i])) {
            ctx.path.push(vals[i]);
            const res = validators[vals[i]](node, ctx, this.config);
            if (res) {
              if (Array.isArray(res)) result.push(...res);
              else result.push(res);
            }
            ctx.path.pop();
          }
        }
        return result;
      },
    };
  }
}

module.exports = ValidateOpenAPIXML;