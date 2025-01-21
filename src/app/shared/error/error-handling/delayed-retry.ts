import { Observable, of, throwError } from 'rxjs';
import { delay, mergeMap, retryWhen } from 'rxjs/operators';

const DEFAULT_MAX_ATTEMPTS = 5;

export function delayedRetry(delayMs: number, maxAttempts = DEFAULT_MAX_ATTEMPTS) {
  let attempts = 1;

  return (src: Observable<any>) =>
    src.pipe(
      retryWhen((errors: Observable<any>) =>
        errors.pipe(
          delay(delayMs),
          mergeMap((error) => (attempts++ > maxAttempts ? of(error) : throwError(error)))
        )
      )
    );
}
