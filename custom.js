// $('.button-collapse').sideNav({
//     menuWidth: 300,
//     edge: 'right',
//     closeOnClick: true,
//     draggable: true
// });
$('.button-collapse').sideNav();

$(function(){

    // Navigation
    $('#bal, #tileBal').click(function(e){
        e.preventDefault();
        $("#content").load("bal.html");
    });
});