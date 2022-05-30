function fadeOut(selector, timeInterval, callback = null) {

    var fadeTarget = document.querySelector(selector);

    let time = timeInterval / 1000;
    fadeTarget.style.transition = time + 's';
    fadeTarget.style.opacity = 0;
    var fadeEffect = setInterval(function() {

        if (fadeTarget.style.opacity <= 0)
        {
            clearInterval(fadeEffect);
            if (typeof (callback) === 'function') {
                callback();
            }
        }
    }, timeInterval);
}