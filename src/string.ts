import { TypeOptions, Type } from './circular-dependencies';
import { Parse } from './parse';
import { Failure } from './failure';
import { ParseInfo } from './ts';

export interface StringOptions extends TypeOptions<string> {
  lt?: number;
  lte?: number;
  gt?: number;
  gte?: number;
  length?: number;
}


/**
 * Represents a parseable string
 */
export class StringType extends Type<string> {
  constructor(public override readonly options?: StringOptions) {
    super();
  }


  /** @inheritdoc */
  handle(unk: unknown, info: ParseInfo): Parse.Output<string> {
    const { isSet } = info;

    // must be set
    if (!isSet) return Parse.fail(Failure.isNotSet);

    switch (typeof unk) {
    // is string
    case 'string': return this._validateLength(unk);
    case 'number':
    case 'boolean':
    case 'bigint':
      // stringify
      return this._validateLength(String(unk));

    // can't nicely stringify
    default:
      return Parse.fail('Must be string-like.');
    }
  }


  /**
   * Parse the bounds
   *
   * @param int       parsed string value
   * @returns         bound validation result
   */
  protected _validateLength(string: string): Parse.Output<string> {
    const {
      length,
      gt,
      gte,
      lt,
      lte,
    } = this.options ?? {};

    const failures = Failure.all();

    // TODO: test
    if (length != null && !(string.length === length)) {
      Failure.add(failures, Failure.create(`Must be a string of length ${length}.`));
    }

    if (gt != null && !(string.length > gt)) {
      Failure.add(failures, Failure.create(`Must be a string of length gt ${gt}.`));
    }

    if (gte != null && !(string.length >= gte)) {
      Failure.add(failures, Failure.create(`Must be a string of length gte ${gte}.`));
    }

    if (lt != null && !(string.length < lt)) {
      Failure.add(failures, Failure.create(`Must be a string of length lt ${lt}.`));
    }

    if (lte != null && !(string.length <= lte)) {
      Failure.add(failures, Failure.create(`Must be a string of length lte ${lte}.`));
    }

    if (!Failure.empty(failures)) {
      return Parse.fail(failures);
    }

    return Parse.success(string);
  }

}

/**
 * Parse as a string
 *
 * @param key               key to extract
 * @param options           string parsing options
 * @returns
 */
export function string(options?: StringOptions): StringType {
  return new StringType(options);
}
