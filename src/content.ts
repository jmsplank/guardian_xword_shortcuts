function simulateButtonClick() {
    const buttonElement = document.querySelector('button[data-link-name="Check this"]');

    if (!buttonElement) {
        return;
    }

    const clickEvent = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        view: window,
    });

    buttonElement.dispatchEvent(clickEvent);
}

document.addEventListener('keydown', (event) => {
    const code = event.code;
    const control = event.ctrlKey;

    console.log(`event: ${control ? 'Ctrl + ' : ''}${code}`)

    if (control && code === 'KeyC') {
        console.log("Hello")
        simulateButtonClick();
    }
});