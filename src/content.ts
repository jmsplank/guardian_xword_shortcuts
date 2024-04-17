function simulateButtonClick() {
  const buttonElement = document.querySelector(
    'button[data-link-name="Check this"]'
  );

  if (!buttonElement) {
    return;
  }

  const clickEvent = new MouseEvent("click", {
    bubbles: true,
    cancelable: true,
    view: window,
  });

  buttonElement.dispatchEvent(clickEvent);
}

document.addEventListener("keydown", (event) => {
  const code = event.code;
  const control = event.ctrlKey;

  console.log(`event: ${control ? "Ctrl + " : ""}${code}`);

  if (control && code === "KeyC") {
    console.log("Hello");
    simulateButtonClick();
  }
});

document.addEventListener("mouseover", function (event) {
  if (!(event.target instanceof HTMLParagraphElement)) {
    return;
  }
  console.log("paragraph!");
  let targetElement = event.target as HTMLParagraphElement;
  let text = targetElement.textContent || targetElement.innerText;

  let clues = findCluesInText(text);
  if (clues == null) {
    return;
  }
  console.log(clues);

  let newText = targetElement.innerHTML;
  for (let i = 0; i < clues.length; i++) {
    console.log(clues[i]);
    newText = newText.replace(
      clues[i],
      `<span id="detected-clue">${clues[i]}</span>`
    );
  }
  console.log(newText);
  targetElement.innerHTML = newText;
});

// Make a box over the page
document.addEventListener("mouseover", (event) => {
  if (!(event.target instanceof HTMLSpanElement)) {
    return;
  }
  let clues = findCluesInText(event.target.innerText);
  if (clues == null) {
    return;
  }
  //   Set overlay text
  let overlayText = [];
  for (let i = 0; i < clues.length; i++) {
    let clue = formatClue(clues[i]);
    overlayText.push(`<p>${getClueText(clue)}</p>`);
  }

  // Create or update the overlay box
  let overlay = document.getElementById("hover-overlay") as HTMLDialogElement;
  if (!overlay) {
    overlay = document.createElement("dialog") as HTMLDialogElement;
    overlay.id = "hover-overlay";
    document.body.appendChild(overlay);
  }

  // Set the text and make the overlay visible
  overlay.innerHTML = `<article>${overlayText.join()}</article>`;
  overlay.show();
});

document.addEventListener("mouseout", function () {
  let overlay = document.getElementById("hover-overlay") as HTMLDialogElement;
  if (overlay) {
    overlay.close();
  }
});

function findCluesInText(text: String): RegExpMatchArray | null {
  let clues = text.match(/[0-9]{1,2} ?(?:a|d)/gim);
  return clues;
}

function formatClue(clue: String): String {
  return clue.toLowerCase().replace(" ", "");
}

function getClueText(clueId: String) {
  // Convert input format '1a' or '1d' to '1-across' or '1-down'
  const convertedId = clueId.replace("a", "-across").replace("d", "-down");

  // Get all clues from the document by their class name
  const clues = document.getElementsByClassName(
    "crossword__clue"
  ) as HTMLCollectionOf<HTMLLinkElement>;

  // Initialize a variable to store the clue text
  let clueText = "";

  // Loop through each clue and check if it matches the converted clueId
  for (let clue of clues) {
    // Get the number and direction from the href attribute
    const hrefAttribute = clue.href;
    const currentClueId = hrefAttribute.substring(
      hrefAttribute.indexOf("#") + 1
    );

    // Check if the current clue ID matches the converted clue ID
    if (currentClueId === convertedId) {
      // Get the text of the clue
      clueText = (
        clue.getElementsByClassName("crossword__clue__text")[0] as HTMLElement
      ).innerText;
      break; // Stop the loop if we find the matching clue
    }
  }

  // Return the formatted string with original input clue ID and text
  return `${clueId}: ${clueText}`;
}
