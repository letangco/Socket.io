const socket = io("http://localhost:3000");

$(document).ready(function () {
    // Nhan danh sach rooms tu server
    socket.on('server-send-rooms', function (data) {
        $('#dsRoom').html("");
        data.map(function (item) {
            $('#dsRoom').append("<h4 class='room' id = '" + item + "' >" + item + "</h4>");
        });
        const btnContainer = document.getElementById('dsRoom');
        const btns = btnContainer.getElementsByClassName("room");
        // current room
        const currentRoom = $('#txtRoom').val();
        for (let i = 0; i < btns.length; i++) {
            btns[i].addEventListener("click", function () {
                socket.emit('chuyen-room', {
                    targetRoom: data[i],
                    currentRoom: currentRoom
                });
            });
        }
    });


    $('#btnTaoRoom').click(function () {
        socket.emit('tao-room', $('#txtRoom').val());
    });

    socket.on('server-send-room-socket', function (data) {
        $('#roomHienTai').html(data);
    });

    $('#bthChat').click(function () {
        socket.emit('user-chat', $('#txtMessenger').val());
        $('#txtMessenger').val('');
    });

    socket.on('server-chat', function (data) {
        $('#right').append('<div>' + data + '</div>');
    });
    $('.room').click(function () {
        const x = document.getElementsByClassName('room');
        console.log(x);
    });

});
