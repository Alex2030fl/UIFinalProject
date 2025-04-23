$( function() {
    // --------------------------------------------------------- HOME.HTML ----------------
    // start quiz button from home page --> quiz
    $("#start-quiz").on("click", function(event) {
        window.location.href = `/quiz`;
    })

    // start learning button from home page --> learning
    $("#start-learning").on("click", function(event) {
        window.location.href = `/learn/1`; // hard coded id = 1 to start with 1st lesson
    })
    
    // --------------------------------------------------------- LEARN.HTML ----------------

    $(document).ready(function () {
        
    })
})