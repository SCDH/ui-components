import * as React from 'react'

/**
 * State that is either controlled (`value` given) or uncontrolled (`defaultValue` given).
 *
 * `setValue` always calls `onChange`; in uncontrolled mode it also updates the internal state.
 */
export function useControllableState<T>({
  value,
  defaultValue,
  onChange
}: {
  value: T | undefined
  defaultValue: T
  onChange?: (value: T) => void
}): [T, (next: T) => void] {
  const [internal, setInternal] = React.useState<T>(defaultValue)
  const isControlled = value !== undefined
  const current = isControlled ? value : internal

  // Keep the latest callback in a ref so `setValue` stays stable
  const onChangeRef = React.useRef(onChange)
  React.useEffect(() => {
    onChangeRef.current = onChange
  })

  const setValue = React.useCallback(
    (next: T) => {
      if (!isControlled) setInternal(next)
      onChangeRef.current?.(next)
    },
    [isControlled]
  )

  return [current, setValue]
}
