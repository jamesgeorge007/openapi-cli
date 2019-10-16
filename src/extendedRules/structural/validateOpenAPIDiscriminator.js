/* eslint-disable class-methods-use-this */
import { createErrorMissingRequiredField, createErrrorFieldTypeMismatch } from '../../error';

import isRuleEnabled from '../utils';
import AbstractRule from '../utils/AbstractRule';

class ValidateOpenAPIDiscriminator extends AbstractRule {
  static get ruleName() {
    return 'discriminator';
  }

  validators() {
    return {
      propertyName: (node, ctx) => {
        if (!(node && node.propertyName)) return createErrorMissingRequiredField('propertyName', node, ctx, { fromRule: this.rule, severity: this.config.level });
        if (typeof node.propertyName !== 'string') return createErrrorFieldTypeMismatch('string', node, ctx, { fromRule: this.rule, severity: this.config.level });
        return null;
      },
      mapping: (node, ctx) => {
        if (node && node.mapping && typeof node.mapping !== 'object') return createErrrorFieldTypeMismatch('Map[string, string]', node, ctx, { fromRule: this.rule, severity: this.config.level });
        if (node && node.mapping && Object.keys(node.mapping).filter((key) => typeof node.mapping[key] !== 'string').length !== 0) return createErrrorFieldTypeMismatch('Map[string, string]', node, ctx, { fromRule: this.rule, severity: this.config.level });
        return null;
      },
    };
  }

  OpenAPIDiscriminator() {
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

module.exports = ValidateOpenAPIDiscriminator;