$(function() {
    // Get data from meta tags
    const appData = {
        totalLessons: parseInt($('#app-data').data('total-lessons')),
        totalQuestions: parseInt($('#app-data').data('total-questions')),
        totalMatchQuizzes: parseInt($('#app-data').data('total-match-quizzes'))
    };

    // Initialize progress bar on diff pages
    function initProgressBar() {
        const path = window.location.pathname;
        
        if (path.startsWith('/learn/')) {
            const lessonId = parseInt(path.split('/').pop());
            // Start at 0
            updateProgressBar(lessonId - 1, appData.totalLessons, false);
        } 
        else if (path.startsWith('/quiz/')) {
            const questionNum = parseInt(path.split('/').pop());
            updateProgressBar(questionNum, appData.totalQuestions, true);
        }
        else if (path.startsWith('/match-order/')) {
            const quizId = parseInt(path.split('/').pop());
            updateProgressBar(quizId, appData.totalMatchQuizzes, true, 'M');
        }
        else if (path.startsWith('/match-results/')) {
            const quizId = parseInt(path.split('/').pop());
            // On results page, show completed progress --- not sure if this works, might delete
            updateProgressBar(quizId + 1, appData.totalMatchQuizzes, true, 'M');
        }
    }

    // Update progress bar function after user moves to next page
    function updateProgressBar(currentStep, totalSteps, isQuiz = false, prefix = 'Q') {
        const displayStep = currentStep + 1;
        const percentage = (currentStep / totalSteps) * 100;
        $('.progress-bar').css('width', percentage + '%');
        $('.progress-bar').attr('aria-valuenow', percentage);
        
        // Update step labels from M - matching, L- learning, Q - quize
        const $stepLabels = $('#step-labels');
        $stepLabels.empty();
        
        // Only show lesson steps during learning
        const stepsToShow = isQuiz ? totalSteps : (prefix === 'M' ? totalSteps : appData.totalLessons);
        
        for (let i = 0; i < stepsToShow; i++) {
            let labelClass = '';
            if (i < currentStep) {
                labelClass = 'completed';
            } else if (i === currentStep) {
                labelClass = 'active';
            }
            
            const labelText = isQuiz ? `${prefix}${i + 1}` : 
                            (prefix === 'M' ? `M${i + 1}` : `L${i + 1}`);
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

    // $("#qz-submit-btn").on("click", function(event) {
    //     event.preventDefault();
    //     const form = $("#qz-quiz-form");
    //     form.submit();
    // });
    $("#qz-submit-btn").on("click", function(event) {
        event.preventDefault();
        // Collect the answers from the drop boxes in matching
        const answers = [];
        $(".qz-drop-box").each(function() {
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
            success: function(response) {
                // Handle successful submission
                window.location.href = response.redirect_url;
            },
            error: function(xhr) {
                // Handle error
                console.error("Submission failed:", xhr.responseText);
            }
        });
    });
});
