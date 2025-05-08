$(function () {
    // Get data from meta tags
    const appData = {
        totalLessons: parseInt($('#app-data').data('total-lessons')),
        totalQuestions: parseInt($('#app-data').data('total-questions')),
        totalMatchQuizzes: parseInt($('#app-data').data('total-match-quizzes'))
    };

    const totalSteps = appData.totalLessons + appData.totalQuestions + appData.totalMatchQuizzes;

    // Initialize progress bar on diff pages
    function initProgressBar() {
        const path = window.location.pathname;
        let currentStep = calculateCurrentStep(path);
        updateUnifiedProgressBar(currentStep, totalSteps);
    }

    // Compute current unified step index from path
    function calculateCurrentStep(path) {
        let step = 0;
        if (path.startsWith('/learn/')) {
            const lessonId = parseInt(path.split('/').pop());
            // Start at 0
            step = lessonId - 1;
        } 
        else if (path.startsWith('/quiz/')) {
            const questionNum = parseInt(path.split('/').pop());
            step = appData.totalLessons + questionNum;
        }
        else if (path.startsWith('/match-order/')) {
            const quizId = parseInt(path.split('/').pop());
            step = appData.totalLessons + appData.totalQuestions + quizId;
        }
        else if (path.startsWith('/match-results/')) {
            const quizId = parseInt(path.split('/').pop());
            // On results page, show completed progress --- not sure if this works, might delete
            step = appData.totalLessons + appData.totalQuestions + quizId + 1;
        }
        return step;
    }

    // Update unified progress bar with section labels (L, Q, M)
    function updateUnifiedProgressBar(currentStep, totalSteps) {
        const percentage = (currentStep / totalSteps) * 100;
        $('.progress-bar').css('width', percentage + '%');
        $('.progress-bar').attr('aria-valuenow', percentage);

        // Update step labels from M - matching, L- learning, Q - quiz
        const $stepLabels = $('#step-labels');
        $stepLabels.empty();

        for (let i = 0; i < totalSteps; i++) {
            let labelClass = '';
            if (i < currentStep) {
                labelClass = 'completed';
            } else if (i === currentStep) {
                labelClass = 'active';
            }

            let labelText;
            if (i < appData.totalLessons) {
                labelText = `L${i + 1}`;
            } else if (i < appData.totalLessons + appData.totalQuestions) {
                labelText = `Q${i - appData.totalLessons + 1}`;
            } else {
                labelText = `M${i - appData.totalLessons - appData.totalQuestions + 1}`;
            }

            $stepLabels.append($('<div>').addClass('step-label ' + labelClass).text(labelText));
        }
    }

    // Home page specific behavior
    if (window.location.pathname === '/') {
        $('.progress-container').hide(); // Optionally hide the progress bar on home page
    } else {
        $('.progress-container').show();
        initProgressBar();
    }

    $("#start-quiz").on("click", function (event) {
        window.location.href = `/quiz/0`;
    });

    $("#start-learning").on("click", function (event) {
        window.location.href = `/learn/1`;
    });

    $(".qz-draggable-box").on("dragstart", function (ev) {
        ev.originalEvent.dataTransfer.setData("text", ev.target.id);
    });

    $(".qz-drop-box").on("dragover", function (ev) {
        ev.preventDefault();
        $(this).css("background-color", "#d9ffd9");
    });

    $(".qz-drop-box").on("dragleave", function (ev) {
        $(this).css("background-color", "#f0f0f0");
    });

    $(".qz-drop-box").on("drop", function (ev) {
        ev.preventDefault();
        const data = ev.originalEvent.dataTransfer.getData("text");
        const draggedElement = $("#" + data);

        if (!$(this).has(draggedElement).length) {
            $(this).append(draggedElement);
        }

        $(this).css("background-color", "#f0f0f0");
    });

    // $("#qz-submit-btn").on("click", function(event) {
    //     event.preventDefault();
    //     const form = $("#qz-quiz-form");
    //     form.submit();
    // });
    $("#qz-submit-btn").on("click", function (event) {
        event.preventDefault();
        // Collect the answers from the drop boxes in matching
        const answers = [];
        $(".qz-drop-box").each(function () {
            const answer = $(this).find('.qz-draggable-box input').val();
            if (answer) {
                answers.push(answer);
            }
        });

        // update prog bar after each matching quiz
        // Submit via AJAX to maintain progress state
        $.ajax({
            url: $("#qz-quiz-form").attr('action'),
            method: 'POST',
            data: { 'answers[]': answers },
            success: function (response) {
                // Handle successful submission
                // Before redirect, update progress bar based on current URL
                const currentStep = calculateCurrentStep(window.location.pathname);
                updateUnifiedProgressBar(currentStep + 1, totalSteps); // assume 1 step forward on submit
                window.location.href = response.redirect_url;
            },
            error: function (xhr) {
                // Handle error
                console.error("Submission failed:", xhr.responseText);
            }
        });
    });
});
