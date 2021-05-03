const socket = io("http://localhost:3000");

$(document).ready(function () {
    // Nhan danh sach rooms tu server
    socket.on('server-send-rooms', function(data) {
        $('#dsRoom').html("");
        data.map(function(item) {
            $('#dsRoom').append("<h4 class='room' >" + item + "</h4>");
        })
    });


    $('#btnTaoRoom').click(function() {
        socket.emit('tao-room', $('#txtRoom').val());
    });

    socket.on('server-send-room-socket', function(data) {
        $('#roomHienTai').html(data);
    });

    $('#bthChat').click(function() {
        socket.emit('user-chat', $('#txtMessenger').val());
        $('#txtMessenger').val('');
    });

    socket.on('server-chat', function(data) {
        $('#right').append('<div>'+ data +'</div>');
    });
});
