const response = await fetch('/db/drag?default={}')
const positions = (await response.json()).data || {};

document.querySelectorAll('.draggable').forEach(widget => {
    const savedPosition = positions[widget.id];
    if (savedPosition) {
        const { left, top } = JSON.parse(savedPosition);
        widget.style.left = left;
        widget.style.top = top;
    }

    const savePosition = () => {
        const position = {
            left: widget.style.left,
            top: widget.style.top
        };
        positions[widget.id] = JSON.stringify(position);
        fetch('/db/drag', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                data: positions
            })
        }).then(response => {
            if (!response.ok) {
                console.error('Failed to save position');
            }
        });
    };

    widget.addEventListener('mousedown', function (e) {
        let offsetX = e.clientX - parseInt(window.getComputedStyle(this).left);
        let offsetY = e.clientY - parseInt(window.getComputedStyle(this).top);

        const moveAt = (e) => {
            this.style.left = e.clientX - offsetX + 'px';
            this.style.top = e.clientY - offsetY + 'px';
        };

        document.addEventListener('mousemove', moveAt);

        document.addEventListener('mouseup', () => {
            document.removeEventListener('mousemove', moveAt);
            savePosition(); // Save position when dragging stops
        }, { once: true });
    });

    widget.addEventListener('touchstart', function (e) {
        let touch = e.touches[0];
        let offsetX = touch.clientX - parseInt(window.getComputedStyle(this).left);
        let offsetY = touch.clientY - parseInt(window.getComputedStyle(this).top);

        const moveAtTouch = (e) => {
            let touch = e.touches[0];
            this.style.left = touch.clientX - offsetX + 'px';
            this.style.top = touch.clientY - offsetY + 'px';
        };

        document.addEventListener('touchmove', moveAtTouch);

        document.addEventListener('touchend', () => {
            document.removeEventListener('touchmove', moveAtTouch);
            savePosition(); // Save position when dragging stops
        }, { once: true });
    });
});
