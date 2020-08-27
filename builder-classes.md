# THIS IS A LIST OF CLASSES THAT CAN BE APPLIED AROUND THE BUILDER TO OBTAIN SOME COMMON DESIRED EFFECTS

SECTIONS
---

- `.background--contain`
  - sets background contain on a section
- `.background--left-top`
  - sets background left-top on a section
- `.background--left-center`
  - sets background left-center on a section
- `.background--left-bottom`
  - sets background left-bottom on a section
- `.background--center-top`
  - sets background center-top on a section
- `.background--center-center`
  - sets background center-center on a section
- `.background--center-bottom`
  - sets background center-bottom on a section
- `.background--right-top`
  - sets background right-top on a section
- `.background--right-center`
  - sets background right-center on a section
- `.background--right-bottom`
  - sets background right-bottom on a section
- `.hide-navigator`
  - Hides the row from being present in the Navigator (currently working only on RexClassic)
- `.disable-grid`
  - Disables a grid on front end (destroy rex-grid instance, set block heights and launch lazy load)
- `.sticky-section`
  - makes a section ***sticky***, whose background remains attached to the viewport while scrolling the section content

BLOCKS
---

- `.rex-element--animated`
  - Add the class to a block, to detect when the block itself is visible after user scrolls page
- `.fit-natural-bg-image`
  - Makes the background image **fit the block** all the way possible, keeping the possibility to make it fluid
- `.deactivate-rexpansive-animation`
  - Cancels the default animation applied by the builder
	- Applied to elements with `.rs-animation`, `.has-rs-animation`, `.rexSlideUpBig`
- `.rex-block--no-flow`
  - Removes a block from the grid on front-end, preventing its instantiation
- `.rex-num-spin__block-scrolled`
  - launch a spin when its block container is visible (obviously must be a spin inside the block)

OTHER
---

- `.intrinsic-ignore`
  - Used to prevent some themes to perform unwanted actions on video elements
- `.rex-num-spin`
  - Add this class to a text span to animate numbers with a spinning rotation
- `.rex-num-spin__stopped`
  - Prevent a spinner to be launched automatically
- `.distance-accordion-toggle`
  - Creates a distance accordion on a button: the button points to a section, that's became an accordion
- `.popup-content-button`
  - Creates a popupcontent button: the button points to a page inside of the site; when clicked appears a popup with the linked page inside