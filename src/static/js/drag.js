document.querySelectorAll('.draggable').forEach(widget => {
    const savedPosition = localStorage.getItem(widget.id);
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
        localStorage.setItem(widget.id, JSON.stringify(position));
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
