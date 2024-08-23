const textarea = document.querySelector('#notes');

let lastInput = 0;
textarea.addEventListener('input', function () {
    lastInput = Date.now();
    setTimeout(function () {
        if (Date.now() - lastInput >= 1000) {
            fetch('/db/notes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    notes: textarea.value,
                }),
            });
        }
    }, 1000);
}, false);

const response = await fetch('/db/notes?default={}');
const data = await response.json();
const notes = data.notes || '';
textarea.value = notes;
