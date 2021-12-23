import { Failure } from "./failure";
import { Result } from "./result";
import { Tree } from "./tree";

/**
 * Represents of parsing values
 */
export namespace Parse {
  /**
   * Output when parsing fails
   */
  export type FailType = Tree.Node<Failure>;

  /**
   * Output result from parsing a value
   */
  export type Output<T> = Result<T, FailType>;

  /**
   * Parsing failed on this point
   */
  export const success = Result.success as (<T>(value: T) => Parse.Output<T>);

  /**
   * Parsing failed on this point
   * 
   * @param reason    reason parsing failed
   * @returns         result type representing the failure
   */
  export function fail<T>(reason: Tree.Node<Failure> | string): Parse.Output<T> {
    if (typeof reason === 'string') {
      return Result.fail(Failure.single(Failure.create(reason)));
    }
    return Result.fail(reason);
  }

  /**
   * Did parsing succeed?
   */
  export const isSuccess = Result.isSuccess as (<T>(output: Parse.Output<T>) => output is Result.Success<T>);

  /**
   * Did parsing fail?
   */
  export const isFail = Result.isFail as (<T>(output: Parse.Output<T>) => output is Result.Fail<Tree.Node<Failure>>);
}