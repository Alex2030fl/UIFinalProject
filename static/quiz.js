$( function() {
    // start quiz button from home page --> learning
    $("#start-quiz").on("click", function(event) {
        window.location.href = `/quiz`;
    })

    // start learning button from home page --> learning
    $("#start-learning").on("click", function(event) {
        window.location.href = `/learn`;
    })

    $(document).ready(function () {
    })
})