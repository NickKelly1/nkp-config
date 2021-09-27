import { TypeOptions, Type } from './circular-dependencies';
import { ParseResult, ParseSuccess } from './ts';

export enum LiteralBehavior {
  HandleAll = 'HandleAll', // default
  HandleSetOnly = 'HandleSetOnly',
  HandleUnsetOnly = 'HandleUnsetOnly',
}

export interface LiteralOptions<T> extends TypeOptions<T> {
  behavior: LiteralBehavior;
}

/**
 * Represents a default string if the value was not defined
 */
export class LiteralType<T> extends Type<T> {
  constructor(
    protected readonly value: T,
    protected override readonly options?: LiteralOptions<T>,
  ) {
    super();
  }

  public override get handlesSet(): boolean {
    switch (this.options?.behavior) {
    case LiteralBehavior.HandleAll: return true;
    case LiteralBehavior.HandleSetOnly: return true;
    case LiteralBehavior.HandleUnsetOnly: return false;
    case undefined: return true;
    default: return true;
    }
  }

  public override get handlesUnset(): boolean {
    switch (this.options?.behavior) {
    case LiteralBehavior.HandleAll: return true;
    case LiteralBehavior.HandleSetOnly: return false;
    case LiteralBehavior.HandleUnsetOnly: return true;
    case undefined: return true;
    default: return false;
    }
  }

  /** @inheritdoc */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  tryParse(unk: unknown): ParseResult<T> {
    return new ParseSuccess(this.value);
  }
}

/**
 * Set as the default value if not defined
 *
 * @param key
 * @param otherwise
 * @returns
 */
export function literal<T>(value: T, options?: LiteralOptions<T>): LiteralType<T> {
  return new LiteralType(value, options);
}
