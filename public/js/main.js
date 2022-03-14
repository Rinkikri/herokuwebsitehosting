const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

// Get username and room from URL
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true,
});

const socket = io();

// Join chatroom
socket.emit('joinRoom', { username, room });

// Get room and users
socket.on('roomUsers', ({ room, users }) => {
    outputRoomName(room);
    outputUsers(users);
});

// Message from server
socket.on('message', (message) => {
    console.log(message);
    /*
    let li = document.createElement('li');
    li.innerText = '${message.from}: ${message.text}'
    document.querySelector('body').appendChild(li);
    */
    outputMessage(message);

    // Scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Message from server
socket.on('locationmessage', (message) => {
    /*console.log("newLocationMessage", message);
        let li = document.createElement('li');
        let a = document.createElement('a');
        a.setAttribute('target', '_blank');
        a.setAttribute('href', message.url);
        a.innerText = 'My current location';
        li.appendChild(a);
    
        document.querySelector('body').appendChild(li);
        outputMessage(message);
    
        // Scroll down
        chatMessages.scrollTop = chatMessages.scrollHeight;
        */
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="sender">$(message.username)<span>${message.time}</span></p>
       <a class="text" href="${message.url}" target="_blank">
       ${message.url}
       </p>`;
    document.querySelector('.chat-messages').appendChild(div);
});

// Message submit
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Get message text
    let msg = e.target.elements.msg.value;

    msg = msg.trim();

    if (!msg) {
        return false;
    }

    // Emit message to server
    socket.emit('chatMessage', msg);

    // Clear input
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
});

// Output message to DOM
function outputMessage(message) {
    const div = document.createElement('div');
    div.classList.add('message');
    const p = document.createElement('p');
    p.classList.add('meta');
    p.innerText = message.username;
    p.innerHTML += `< span > ${message.time}</span > `;
    div.appendChild(p);
    const para = document.createElement('p');
    para.classList.add('text');
    para.innerText = message.text;
    div.appendChild(para);
    document.querySelector('.chat-messages').appendChild(div);
}

// Add room name to DOM
function outputRoomName(room) {
    roomName.innerText = room;
}

// Add users to DOM
function outputUsers(users) {
    userList.innerHTML = '';
    users.forEach((user) => {
        const li = document.createElement('li');
        li.innerText = user.username;
        userList.appendChild(li);
    });
}

//Prompt the user before leave chat room
document.getElementById('leave-btn').addEventListener('click', () => {
    const leaveRoom = confirm('Are you sure you want to leave the chatroom?');
    if (leaveRoom) {
        window.location = '../index.html';
    } else {
    }
});

/*
document.querySelector('#submit-btn').addEventListener('click', function (e) {
    e.preventDefault();
    socket.emit("createMessage", {
        form: User,
        text:
            document.querySelector('input[name="message"]').value
    }, function () {
    })
})
*/

// Api geolocation
document.querySelector('#send-location').addEventListener('click', function (e) {
    e.preventDefault();
    if (!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser.');
    }

    navigator.geolocation.getCurrentPosition(function (position) {

        socket.emit('location', {
            lat: position.coords.latitude,
            lng: position.coords.longitude
        })
    }, function () {
        alert('Unable to fetch location.');
    })
});