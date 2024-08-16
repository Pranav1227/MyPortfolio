document.addEventListener('DOMContentLoaded', () => {
    const circles = document.querySelectorAll('.inner-circle');
    circles.forEach(circle => {
        let percent = circle.getAttribute('data-percent');
        const percentNumber = document.createElement('div');
        percentNumber.classList.add('percent-number');
        percentNumber.innerText = percent + '%';
        circle.appendChild(percentNumber);
        let currentPercent = 0;
        let interval = setInterval(() => {
            currentPercent++;
            circle.style.background = `conic-gradient(
                #dc3545 ${currentPercent * 3.6}deg,
                #111 ${currentPercent * 3.6}deg
            )`;
            if (currentPercent >= percent) {
                clearInterval(interval);
            }
        }, 20);
    });
});
