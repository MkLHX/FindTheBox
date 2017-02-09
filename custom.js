$('.button-collapse').sideNav();

$(function(){
    //back to top button
    $('.back-to-top').on('click', function(){
        $('html, body').animate({ scrollTop: 0 }, 600);
    });

    // //sticky navbar
    // var jumboSize = $('#jumbotron').height();
    // var marginTopOffset = -jumboSize-20;
    // $(window).scroll(function (event) {
    //     var scroll = $(window).scrollTop();
    //     if(scroll>=jumboSize){
    //         $('#navwrap').addClass('navbar-fixed').css('margin-top',marginTopOffset);
    //     }else{
    //         $('#navwrap').removeClass('navbar-fixed').css('margin-top',0);
    //     }
    // });

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