"use strict";

$(function () {
  var $audio = $("audio"),
      // from https://tide.moreless.io/en/
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
    $incrSession.click(function () {
      return incrSession();
    });
    $decrSession.click(function () {
      return decrSession();
    });
    $incrBreak.click(function () {
      return incrBreak();
    });
    $decrBreak.click(function () {
      return decrBreak();
    });
    $sessionInput.on("change", function (e) {
      return updateSession(e.target.value);
    });
    $breakInput.on("change", function (e) {
      return updateBreak(e.target.value);
    });
    $start.click(function () {
      if (countType === "break") {
        startBreak();
      } else {
        startSession();
      }
    });
    $pause.click(function () {
      return pause();
    });
    $reset.click(function () {
      return reset();
    });
    $theme.click(function (e) {
      return audioSelect(e);
    });
  }

  function startSession() {
    sessionNum++;
    countType = "session";
    $options.slideUp(143);
    $controls.removeClass().addClass("started");
    $title.fadeOut(43, function () {
      $(this).html("Session " + sessionNum).fadeIn();
    });
    $audio.animate({
      volume: 1
    }, 1000);
    start(remainingTime || sessionLength);
  }

  function startBreak() {
    countType = "break";
    $title.fadeOut(43, function () {
      $(this).html("Break " + sessionNum).fadeIn();
    });
    $audio.animate({
      volume: 0
    }, 5000);
    start(remainingTime || breakLength);
  }

  function start(timeLeft) {
    clearInterval(countdown);
    countdown = setInterval(function () {
      timeLeft--;
      remainingTime = timeLeft;
      var minLeft = Math.floor(timeLeft / 60),
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
    $audio.animate({
      volume: 0
    }, 1000);
    clearInterval(countdown);
    $options.slideDown(143);
    $controls.removeClass().addClass("paused");
    $title.fadeOut(43, function () {
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
    var num = Number($sessionInput.val());
    num = num + (num === sessionMax ? 0 : 1);
    sessionLength = num * 60;
    updateSession(num);
    updateMinutes(num);
    updateSeconds("00");
    reset();
  }

  function decrSession() {
    var num = Number($sessionInput.val());
    num = num - (num === sessionMin ? 0 : 1);
    sessionLength = num * 60;
    updateSession(num);
    updateMinutes(num);
    updateSeconds("00");
    reset();
  }

  function incrBreak() {
    var num = Number($breakInput.val());
    num = num + (num === breakMax ? 0 : 1);
    breakLength = num * 60;
    updateBreak(num);
    reset();
  }

  function decrBreak() {
    var num = Number($breakInput.val());
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