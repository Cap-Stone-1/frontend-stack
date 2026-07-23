# TODO / Known Issues

## Bugs

- [ ] **CreatePoll.jsx — removing an option permanently disables the submit button.**
  Repro: fill in 3 valid options, add a 4th and leave it empty, click "Create Poll"
  (correctly shows "Option is required." under it), then click "Remove Option" on
  that empty option. The submit button stays disabled forever afterward, even
  though every remaining option is valid.

  Root cause: the "Remove Option" button only updates `allOptions` — it never
  clears the removed option's leftover entry in `errorMessages` (e.g.
  `errorMessages.option3` stays `"Option is required."` forever), and the submit
  button's `disabled` check reads directly from `errorMessages`. Removing from
  the middle of the list has a second version of this bug: remaining options
  shift down an index, but their old error/touched entries don't shift with them.

  Fix direction: give the remove button its own `handleRemoveOption(index)`
  function that, alongside `setAllOptions`, also re-keys `errorMessages` and
  `isTouched` — dropping the removed index and shifting every `optionN` where
  `N > index` down to `N - 1`.
