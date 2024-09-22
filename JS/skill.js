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


// Arrow js 

const scrollToTopBtn = document.getElementById("scrollToTopBtn");

window.onscroll = function () {
    if (document.body.scrollTop > 400 || document.documentElement.scrollTop > 400) {
        scrollToTopBtn.classList.add('show');
    } else {
        scrollToTopBtn.classList.remove('show');
    }
};

scrollToTopBtn.addEventListener('click', function (event) {
    event.preventDefault();
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});