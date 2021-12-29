/**
 * Generic result types
 *
 * Represents successful or failed operations
 */
export type Result<T, F> =
  | Result.Success<T>
  | Result.Fail<F>;

export namespace Result {
  /**
   * Type of result
   */
  export enum Type {
    Success = 'Success',
    Fail = 'Fail',
  }

  /**
   * Base result
   */
  export interface BaseResult<U, T extends Type> {
    type: T
    value: U
  }

  /**
   * Success type
   */
  export interface Success<T> extends BaseResult<T, Type.Success> {}

  /**
   * Failure type
   */
  export interface Fail<F> extends BaseResult<F, Type.Fail> {}


  /**
   * Is the output a "success" result
   *
   * @param output    result output
   * @returns         whether the output is a "success" result
   */
  export function isSuccess<T, F>(output: Result<T, F>): output is Success<T> {
    return output.type === Type.Success;
  }

  /**
   * Is the output a "fail" result
   *
   * @param output    result output
   * @returns         whether the output is a "fail" result
   */
  export function isFail<T, F>(output: Result<T, F>): output is Fail<F> {
    return output.type === Type.Fail;
  }

  /**
   * Create a "success" result
   *
   * @param value     success value
   * @returns         success result
   */
  export function success<T>(value: T): Success<T> {
    return {
      type: Type.Success,
      value,
    };
  }

  /**
   * Create a "fail" result
   *
   * @param value   fail value
   * @returns       fail result
   */
  export function fail<F>(value: F): Fail<F> {
    return {
      type: Type.Fail,
      value,
    };
  }
}