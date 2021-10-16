$(() => {

    let $audio = $("audio"), // from https://tide.moreless.io/en/
        $theme = $(".theme"),
        $title = $("#title"),
        $controls = $("#controls"),
        $options = $("#options"),
        $minutes = $("#minutes"),
        $seconds = $("#seconds"),
        $start = $("#start"),
        $pause = $("#pause"),
        $reset = $("#reset"),
        $incrSession = $("#incrSession"),
        $sessionInput = $("#sessionInput"),
        $decrSession = $("#decrSession"),
        $incrBreak = $("#incrBreak"),
        $breakInput = $("#breakInput"),
        $decrBreak = $("#decrBreak"),
        breakLength = 5 * 60,
        breakMax = 10,
        breakMin = 1,
        sessionLength = 30 * 60,
        sessionMax = 60,
        sessionMin = 5,
        sessionNum = 0,
        countdown,
        countType,
        remainingTime = sessionLength;

    init();

    function init() {
        $audio.prop("volume", 0);
        $incrSession.click(() => incrSession());
        $decrSession.click(() => decrSession());
        $incrBreak.click(() => incrBreak());
        $decrBreak.click(() => decrBreak());
        $sessionInput.on("change", e => updateSession(e.target.value));
        $breakInput.on("change", e => updateBreak(e.target.value));
        $start.click(() => { if (countType === "break") { startBreak(); } else { startSession(); } });
        $pause.click(() => pause());
        $reset.click(() => reset());
        $theme.click(e => audioSelect(e));
    }

    function startSession() {
        sessionNum++;
        countType = "session";
        $options.slideUp(143);
        $controls.removeClass().addClass("started");
        $title.fadeOut(43, function() {
            $(this).html("Session " + sessionNum).fadeIn();
        });
        $audio.animate({ volume: 1 }, 1000);
        start(remainingTime || sessionLength);
    }

    function startBreak() {
        countType = "break";
        $title.fadeOut(43, function() {
            $(this).html("Break " + sessionNum).fadeIn();
        });
        $audio.animate({ volume: 0 }, 5000);
        start(remainingTime || breakLength);
    }

    function start(timeLeft) {
        clearInterval(countdown);
        countdown = setInterval(() => {
            timeLeft--;
            remainingTime = timeLeft;
            let minLeft = Math.floor(timeLeft / 60),
                secLeft = timeLeft - minLeft * 60;
            updateMinutes(minLeft);
            updateSeconds(secLeft < 10 ? "0" + secLeft : secLeft);
            if (timeLeft < 1) {
                if (countType === "session") {
                    startBreak(breakLength);
                } else {
                    startSession();
                }
            }
        }, 1000);
    }

    function pause() {
        sessionNum--;
        $audio.animate({ volume: 0 }, 1000);
        clearInterval(countdown);
        $options.slideDown(143);
        $controls.removeClass().addClass("paused");
        $title.fadeOut(43, function() {
            $(this).html("Paused").fadeIn();
        });
    }

    function reset() {
        clearInterval(countdown);
        updateMinutes(sessionLength / 60);
        updateSeconds("00");
        countType = undefined;
        $controls.removeClass().addClass("reset");
        $title.html("Ready?");
        remainingTime = sessionLength;
    }

    function incrSession() {
        let num = Number($sessionInput.val());
        num = num + (num === sessionMax ? 0 : 1);
        sessionLength = num * 60;
        updateSession(num);
        updateMinutes(num);
        updateSeconds("00");
        reset();
    }

    function decrSession() {
        let num = Number($sessionInput.val());
        num = num - (num === sessionMin ? 0 : 1);
        sessionLength = num * 60;
        updateSession(num);
        updateMinutes(num);
        updateSeconds("00");
        reset();
    }

    function incrBreak() {
        let num = Number($breakInput.val());
        num = num + (num === breakMax ? 0 : 1);
        breakLength = num * 60;
        updateBreak(num);
        reset();
    }

    function decrBreak() {
        let num = Number($breakInput.val());
        num = num - (num === breakMin ? 0 : 1);
        breakLength = num * 60;
        updateBreak(num);
        reset();
    }

    function updateMinutes(num) {
        $minutes.text(num);
    }

    function updateSeconds(num) {
        $seconds.text(num);
    }

    function updateSession(num) {
        num = num < sessionMin ? sessionMin : num > sessionMax ? sessionMax : num;
        $sessionInput.val(num).blur();
        updateMinutes(num);
        updateSeconds("00");
        sessionLength = num * 60;
        reset();
    }

    function updateBreak(num) {
        $breakInput.val(num < breakMin ? breakMin : num > breakMax ? breakMax : num).blur();
        breakLength = num * 60;
        reset();
    }

    function audioSelect(e) {
        $theme.removeClass("selected");
        $(e.target).addClass("selected");
        switch (e.target.id) {
            case "forest":
                $audio.attr("src", "https://joeweaver.me/codepenassets/freecodecamp/challenges/build-a-pomodoro-clock/forest.mp3");
                break;
            case "ocean":
                $audio.attr("src", "https://joeweaver.me/codepenassets/freecodecamp/challenges/build-a-pomodoro-clock/ocean.mp3");
                break;
            case "rainy":
                $audio.attr("src", "https://joeweaver.me/codepenassets/freecodecamp/challenges/build-a-pomodoro-clock/rain.mp3");
                break;
            case "peace":
                $audio.attr("src", "https://joeweaver.me/codepenassets/freecodecamp/challenges/build-a-pomodoro-clock/peace.mp3");
                break;
            case "cafe":
                $audio.attr("src", "https://joeweaver.me/codepenassets/freecodecamp/challenges/build-a-pomodoro-clock/cafe.mp3");
                break;
        }
    }

});