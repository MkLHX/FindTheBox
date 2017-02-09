// $('.button-collapse').sideNav();

$(function(){
    //back to top button
    $('.back-to-top').on('click', function(){
        $('html, body').animate({ scrollTop: 0 }, 600);
    });
    // Navigation
    $('.bal, #tileBal').click(function(e){
        e.preventDefault();
        $("#content").load("bal.html");
    });
    $('.vet, #tileVet').click(function(e){
        e.preventDefault();
        $("#content").load("vet.html");
    });
    $('.bottle, #tileBottle').click(function(e){
        e.preventDefault();
        $("#content").load("bottle.html");
    });
});