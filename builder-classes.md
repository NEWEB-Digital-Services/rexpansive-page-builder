# THIS IS A LIST OF CLASSES THAT CAN BE APPLIED AROUND THE BUILDER TO OBTAIN SOME COMMON DESIRED EFFECTS

- .deactivate-rexpansive-animation
  - Cancels the default animation applied by the builder
	- Applied to elements with .rs-animation, .has-rs-animation, .rexSlideUpBig
- .hide-navigator
  - Hides the row from being present in the Navigator (currently working only on RexClassic)
- .intrinsic-ignore
  - Used to prevent some themes to perform unwanted actions on video elements
- .fit-natural-bg-image
  - Makes the background image **fit the block** all the way possible, keeping the possibility to make it fluid
- .disable-grid
  - Disables a grid on front end (destroy rex-grid instance, set block heights and launch lazy load)
- .rex-block--no-flow
  - Removes a block from the grid on front-end, preventing its instantiation
- .rex-element--animated
  - Add the class to a block, to detect when the block itself is visible after user scrolls page