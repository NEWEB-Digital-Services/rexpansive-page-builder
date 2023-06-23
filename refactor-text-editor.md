# REFACTOR THE BLOCK TEXT EDITOR

## ACTUAL FEATURES

1) When adding a text block the editor is already instantiated and the cursor placed inside the block, ready to edit
 1.1) there is also a placeholder "Type your text here"
 1.2) at the top right of the block there is a button to open the HTML editor
 1.3) at the bottom right there is a list of tools (visibile on hover); with the tools user can:
  1.3.1) insert an inline image
   1.3.1.1) on click, this opens the wordpress media window
   1.3.1.2) once inserted, user can select the image; when selected appears a toolbar that allows to:
    1.3.1.2.1) align the image (left, center, right, justified)
    1.3.1.2.2) apply the zoom function to the image
    1.3.1.2.3) replace the image, opening again the wordpress media window
    1.3.1.2.4) remove the image
   1.3.1.3) user also can resize the image with the handles on the image corners
  1.3.2) insert an inline video
   1.3.2.1) on click, this opens a modal with a text input where placing an url from youtube, vimeo, dailymotione ... 
   1.3.2.2) once insered, user can select the video 
   1.3.2.3) user can resize the video with the handles on the video corners
  1.3.3) insert an inline icon
   1.3.3.1) on click this opend a modal with a list of icons; user select the icon and place it with save button
    1.3.3.1.1) once inserted, user can select the icon; when selected appears a toolbar that allows to:
	 1.3.3.1.1.1) change icon color
	 1.3.3.1.1.2) replace the icon
	 1.3.3.1.1.3) decide if icon is inline or not
	 1.3.3.1.1.4) remove the icon
    1.3.3.2) user also can resize the icon with the handles on the image corners
2) After entering the text user can select text with double click; on select the editor opens a toolbar; the tools are:
 2.1) color picker, to set the color of the text
 2.2) format text with bold, italic or underline
 2.3) inerting a link
 2.4) changing the text type, heading or paragraph
 2.5) align the text
 2.6) inserting an ordered or unordered list
 2.7) align the text inside the block, therefore horizontal and vertical
 2.8) edit the HTML opening the modal editor

## NOTES

- New editor must achieve all of these opportunities
- Old editor does not replace div elements, leaving the tags and manipulating only the text

## EDITOR ALTERNATIVES

- editorjs [https://editorjs.io/]
- ckeditor [https://ckeditor.com/docs/ckeditor5/latest/installation/getting-started/predefined-builds.html#installation-example-3]
