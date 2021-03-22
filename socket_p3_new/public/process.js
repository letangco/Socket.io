const socket = io("http://localhost:3000");

socket.on('server-send-dang-ki-that-bai', function () {
    alert("Sai username, có người đăng ký rồi");
});

socket.on('server-send-dang-ki-thanh-cong', function (data) {
    $("#currentUser").html(data);
    $("#loginForm").hide();
    $("#chatForm").show();
});

socket.on('server-send-danh-sach-user', function (data) {
    $("#boxContent").html("");
    data.forEach(element => {
        $("#boxContent").append("<div class='user'>" + element + "</div>")
    });
});

socket.on('server-send-message', function(data) {
    $('#listMessages').append("<div class='ms'>" + data.user+": "+ data.message + "</div>")
});

socket.on('server-send-user-is-typing', function(data){
    $('#isTyping').html(data);
});

socket.on('server-send-user-no-typing', function(){
    $('#isTyping').html("");
});

$(document).ready(function () {
    $("#loginForm").show(2000);
    $("#chatForm").hide(1000);
    $("#btnRegister").click(function () {
        socket.emit('client-send-Username', $("#txtUsername").val());
    });
    $("#btnLogout").click(function () {
        socket.emit('logout');
        $("#loginForm").show(2000);
        $("#chatForm").hide(1000);
    });
    $("#btnSendMesage").click(function () {
        socket.emit('user-send-message', $("#txtMessage").val());
        $("#txtMessage").val("");
    });
    $("#txtMessage").focusin(function(){
        socket.emit('toi-dang-go-chu');
    });
    $("#txtMessage").focusout(function(){
        socket.emit('khong-go-chu');
    });
});
