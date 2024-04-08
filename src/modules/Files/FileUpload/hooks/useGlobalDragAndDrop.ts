import React, { useState, useEffect } from "react";

const useGlobalDragAndDrop = () => {
  const [isDragging, setDragging] = React.useState(false);

  // A flag to check if a file is being dragged in from the operating system.
  const isFileFromOS = React.useRef(true);
  // We will cache the target that we first drag over when dragenter fires.
  // This will allow us to compare the cached value with the target that
  // dragleave returns and check whether the dragged item is really out of view.
  const cachedTarget = React.useRef<EventTarget | null>(null);

  const hasDraggedFileFromBrowserOutsideOfWindow = React.useRef(false);

  React.useEffect(() => {
    const handleDragEnter = (e: DragEvent) => {
      cachedTarget.current = e.target;
    };
    // dragstart event only fires when a file is dragged from within the browser
    // window. It won't be fired when coming from the OS.
    const handleDragStart = () => {
      isFileFromOS.current = false;
      hasDraggedFileFromBrowserOutsideOfWindow.current = false;
      console.log("Drag started from browser");
    };

    const handleDragOver = (e: DragEvent) => {
      // e.preventDefault will allow us to drag a file in the browser without it opening.
      e.preventDefault();

      // If document still has focus, that means the user never dropped the file.
      if (
        hasDraggedFileFromBrowserOutsideOfWindow.current &&
        document.hasFocus()
      ) {
        console.log("Dragged file back into view from browser");
      } else if (isFileFromOS.current) {
        console.log("Dragging from OS");
        hasDraggedFileFromBrowserOutsideOfWindow.current = false;

        if (!isDragging) setDragging(true);
      } else {
        console.log("Dragging from browser");
      }
    };

    const handleDragLeave = (e: DragEvent) => {
      if (e.target === cachedTarget.current) {
        if (
          isFileFromOS.current &&
          !hasDraggedFileFromBrowserOutsideOfWindow.current
        ) {
          console.log("Left view from OS");

          if (isDragging) setDragging(false);
        } else {
          // Left view from browser. If a user drops an item here, we won't be able to
          // capture that event since it's outside of the window. We need to somehow
          // find out if at any point the document loses focus; aka the user opened
          // a Finder/Explorer window to drag a new file in.
          // We will set a flag to signal that the file has been dragged outside of
          // the window so our dragover handler can compare this with document.hasFocus()
          // to check if the user has tabbed out to drag another file from the OS.
          console.log("Left view from browser");
          hasDraggedFileFromBrowserOutsideOfWindow.current = true;
          // Reset isFileFromOS flag
          isFileFromOS.current = true;
        }
      }
    };

    const handleDrop = (e: DragEvent) => {
      // Again, e.preventDefault needs to be here and on dragover event
      // to prevent the file from opening in the browser.
      console.log("drop");
      e.preventDefault();
      // Reset isFileFromOS flag
      isFileFromOS.current = true;
      hasDraggedFileFromBrowserOutsideOfWindow.current = false;

      if (isDragging) setDragging(false);
    };

    window.addEventListener("dragenter", handleDragEnter);
    window.addEventListener("dragstart", handleDragStart);
    window.addEventListener("dragover", handleDragOver);
    window.addEventListener("dragleave", handleDragLeave);
    window.addEventListener("drop", handleDrop);

    // Cleanup.
    return () => {
      window.removeEventListener("dragenter", handleDragEnter);
      window.removeEventListener("dragstart", handleDragStart);
      window.removeEventListener("dragover", handleDragOver);
      window.removeEventListener("dragleave", handleDragLeave);
      window.removeEventListener("drop", handleDrop);
    };
  }, [isDragging]);

  return { isDragging };
};

export default useGlobalDragAndDrop;
