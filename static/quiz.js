$(function() {
    $("#start-quiz").on("click", function(event) {
        window.location.href = `/quiz/0`;
    });

    $("#start-learning").on("click", function(event) {
        window.location.href = `/learn/1`;
    });

    $(".qz-draggable-box").on("dragstart", function(ev) {
        ev.originalEvent.dataTransfer.setData("text", ev.target.id);
    });

    $(".qz-drop-box").on("dragover", function(ev) {
        ev.preventDefault();
        $(this).css("background-color", "#d9ffd9");
    });

    $(".qz-drop-box").on("dragleave", function(ev) {
        $(this).css("background-color", "#f0f0f0");
    });

    $(".qz-drop-box").on("drop", function(ev) {
        ev.preventDefault();
        const data = ev.originalEvent.dataTransfer.getData("text");
        const draggedElement = $("#" + data);

        if (!$(this).has(draggedElement).length) {
            $(this).append(draggedElement);
        }

        $(this).css("background-color", "#f0f0f0");
    });

    window.qzSubmitForm = function() {
        const dropAreas = $(".qz-drop-box");
        let allFilled = true;

        dropAreas.each(function() {
            if ($(this).children().length === 0) {
                allFilled = false;
            }
        });

        if (allFilled) {
            $("#qz-quiz-form").submit();
        } else {
            alert("Please complete all drop areas.");
        }
    };

    $(".qz-match-overlay").on("click", function() {
        $(this).fadeOut();
    });
});
