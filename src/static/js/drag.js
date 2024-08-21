document.querySelectorAll('.draggable').forEach(widget => {
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
        }, { once: true });
    });
});