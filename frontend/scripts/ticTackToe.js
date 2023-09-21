let socket = io("https://tictoe.onrender.com/", { transports: ["websocket"] })

const myPeer = new Peer()
let url = window.location.href
let roomId = url.split("/").pop()


myPeer.on("open", id => {

    document.querySelector("#firstBt").addEventListener("click", () => {
        let firstUserName = document.querySelector("#firstNameValue").value
        socket.emit("firstClick", { roomId, id, firstUserName })
        document.querySelector("#firstName").style.display = 'none'
        document.querySelector("#link").style.display = 'block'
        document.querySelector("#link>div>p").innerText = url
    })

    document.querySelector("#secClick").addEventListener("click", () => {
        let secUserName = document.querySelector("#secNameValue").value
        socket.emit("SecName", { roomId, id, secUserName })
    })

})


document.querySelector("#link>div").addEventListener("click", () => {
    let ans = document.querySelector("#link>div>p").innerText
    navigator.clipboard.writeText(ans)
    document.querySelector("#copyy").innerHTML = `<i style='color:green' class="fa-solid fa-check"></i>`
})


socket.on("secInput", (usename) => {
    document.querySelector("#SecName>h4").innerText = `${usename} have invited you`
    document.querySelector("#chatNav>div>p").innerText = usename
    document.querySelector("#firstName").style.display = 'none'
    document.querySelector("#link").style.display = 'none'
    document.querySelector("#SecName").style.display = 'block'
})


socket.on("nameDisplay", (secuser) => {
    document.querySelector("#chatNav>div>p").innerText = secuser
})

socket.on("final", (msg) => {
    document.querySelector("#EnTrance").style.display = "none"
    document.querySelector("#main").style.display = "flex"
})

document.querySelector("#msgBtn").addEventListener("click", () => {

    let msg = document.querySelector("#msg").value
    if (msg == "") {
        return;
    }
    document.querySelector("#msg").value = ""
    socket.emit("msgCap", (msg))

})

socket.on("rightSide", (msg) => {
    document.querySelector("#chatCont").innerHTML += `
    <div id="mainR">
        <div id="right">
            <p id="RMM">${msg.msg}</p>
            <div class="Rcls">
                <p id="Rusr1">${msg.username}</p>
                <div id="spn"></div>
                <p id="Rusr2">${msg.time}</p>
            </div>
        </div>
    </div>
 `




})

socket.on("leftSide", (msg) => {
    document.querySelector("#chatCont").innerHTML += `
    <div id="mainL">
        <div id="right">
            <p id="RMM">${msg.msg}</p>
            <div class="Rcls">
                <p id="Rusr1">${msg.username}</p>
                <div id="spn"></div>
                <p id="Rusr2">${msg.time}</p>
            </div>
        </div>
    </div>
    `
})









// video call functionality

let callMe = async () => {
    return await navigator.mediaDevices.getUserMedia({
        video: true
    })
}
let pehlaStream;
document.querySelector("#chatNav button").addEventListener("click", async () => {
    document.querySelector("#outGoing>div>p").innerText = `OutGoing Call to ${document.querySelector("#chatNav>div>p").innerText}`
    document.querySelector("#outGoing").style.display = 'grid'
    document.querySelector("#chat").style.display = 'none'
    document.querySelector("#videoContainer").style.display = 'block'
    document.querySelector("#callDisconnect").style.display = 'none'
    document.querySelector("#remote").style.display = 'none'
    let firstStream = await callMe()
    console.log(firstStream);
    pehlaStream = firstStream
    addVideo(local, firstStream)
    socket.emit("callReq", "ntgmsg")
})



socket.on("callReqServer", (msg) => {
    document.querySelector("#inName").innerText = `${document.querySelector("#chatNav>div>p").innerText}`
    document.querySelector("#inComing").style.display = 'grid'
    document.querySelector("#videoContainer").style.display = 'none'
    document.querySelector("#chat").style.display = 'none'
})

let dusraStream;
document.querySelector("#accept").addEventListener("click", async () => {
    socket.emit("callAccepted", "ntg msg")
    document.querySelector("#outGoing").style.display = 'none'
    document.querySelector("#inComing").style.display = 'none'
    document.querySelector("#videoContainer").style.display = 'block'
    document.querySelector("#callDisconnect").style.display = 'block'
    let secStream = await callMe()
    console.log(secStream);
    dusraStream = secStream
    addVideo(local, secStream)
})


socket.on("callAcceptedServer", (peerId) => {
    connect(peerId)
})

myPeer.on("call", call => {
    call.answer(dusraStream)
    call.on('stream', userVideoStream => {
        console.log(userVideoStream);
        addVideo(remote, userVideoStream)
    })
})

async function connect(peerId) {
    document.querySelector("#outGoing").style.display = 'none'
    document.querySelector("#videoContainer").style.display = 'block'
    document.querySelector("#remote").style.display = 'block'
    document.querySelector("#callDisconnect").style.display = 'block'
    let call = myPeer.call(peerId, pehlaStream)
    call.on("stream", userVideoStream => {
        console.log(userVideoStream);
        addVideo(remote, userVideoStream)
    })

}


document.querySelector("#callDisconnect").addEventListener("click", async () => {
    document.querySelector("#videoContainer").style.display = 'none'
    document.querySelector("#chat").style.display = 'block'
    for (const track of local.srcObject.getTracks()) {
        track.stop();
    }
})


function addVideo(video, stream) {
    video.srcObject = stream
    video.addEventListener("loadedmetadata", () => {
        video.play()
    })
}



// voice recognition
let sr = window.webkitSpeechRecognition || window.SpeechRecognition
let spRec = new sr()
spRec.continuous = true;
spRec.interimResults = true;
document.querySelector("#micro").addEventListener("click", () => {
    // document.querySelector("#msg").value = ""
    spRec.start()
})
spRec.onresult = res => {
    console.log(res);
    let text = Array.from(res.results).map(r => r[0])
        .map(txt => txt.transcript).join("")
    // let text = res.results[0][0].transcript;
    document.querySelector("#msg").value = text

}

document.querySelector("#msgBtn").addEventListener("click", () => {
    spRec.stop()
    document.querySelector("#msg").value = ""

})





// underLine functionality
let isDragging = false;

document.querySelector("#underLine").addEventListener('mousedown', (event) => {
    isDragging = true;
});

document.querySelector("#underLine").addEventListener('mousemove', (event) => {
    if (isDragging) {
        const containerWidth = document.querySelector('#main').offsetWidth;
        const mouseX = event.clientX;
        document.querySelector("#tictack").style.width = `${mouseX}px`;
        document.querySelector("#chat").style.width = `${containerWidth - mouseX}px`;

    }
});

document.querySelector("#underLine").addEventListener('mouseup', () => {
    isDragging = false;
});








// script of tictack

let firstPlayer;
let secPlayer;
let origBoard;
const winCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 4, 8],
    [6, 4, 2],
    [2, 5, 8],
    [1, 4, 7],
    [0, 3, 6]
];
let cells = document.querySelectorAll(".cell")
let have;
function selectSym(sym) {
    firstPlayer = sym
    sym == 'O' ? secPlayer = 'X'
        : secPlayer = 'O'
    have = firstPlayer
    origBoard = [0, 1, 2, 3, 4, 5, 6, 7, 8]
    document.querySelector(".selectSym").style.display = 'none'
    for (let i = 0; i < cells.length; i++) {
        cells[i].addEventListener("click", turnClick)
    }
}

function startGame() {

    socket.emit("chance", ("msg"))
}

socket.on("safai", (mdg) => {
    // console.log("came to safai");
    document.querySelector('.endgame').style.display = "none";
    document.querySelector('.endgame .text').innerText = "";
    for (let i = 0; i < cells.length; i++) {
        cells[i].innerText = '';
        cells[i].style.removeProperty('background-color');
    }
})
socket.on("select", (msg) => {

    document.querySelector(".selectSym").style.display = 'block'

})

socket.on("sECpLAYER", ({ ans, firstP, secP }) => {
    firstPlayer = firstP;
    secPlayer = secP;
    have = ans
    // document.querySelector("td").style.border='border: 1px solid black';
    for (let i = 0; i < cells.length; i++) {
        cells[i].addEventListener("click", turnClick)
        cells[i].style.border = '1px solid black';
    }
})

socket.on("sq", ({ squareId, player, origB }) => {
    origBoard = origB
    origBoard[squareId] = player;
    document.getElementById(squareId).innerHTML = player;
})

function turnClick(square) {
    // console.log(origBoard);
    if (typeof origBoard[square.target.id] === 'number') {
        turn(square.target.id, have);
        if (!checkWin(origBoard, have) && !checkTie()) {
            let ans;
            if (have == firstPlayer) {
                ans = secPlayer
            } else {
                ans = firstPlayer
            }
            for (let i = 0; i < cells.length; i++) {
                cells[i].removeEventListener("click", turnClick)
                cells[i].style.border = '1px solid grey';
            }

            socket.emit("secTime", ({ ans, firstP: firstPlayer, secP: secPlayer }))
        }
    }
}








function turn(squareId, player) {
    origBoard[squareId] = player;
    document.getElementById(squareId).innerHTML = player;
    socket.emit("innerHtml", ({ squareId, player, origB: origBoard }))
    let gameWon = checkWin(origBoard, player);
    if (gameWon) {
        gameOver(gameWon);
        socket.emit("decl", { gameWon })
    }
    checkTie();


}

socket.on("sab", ({ gameWon }) => {

    gameOver(gameWon)


    checkTie()

})

function checkWin(board, player) {
    let plays = []
    for (let i = 0; i < board.length; i++) {
        if (board[i] === player) {
            plays.push(i)
        }
    }
    let gameWon = null
    for (let i = 0; i < winCombos.length; i++) {
        let isWinningCombo = true;
        for (let j = 0; j < winCombos[i].length; j++) {
            if (!plays.includes(winCombos[i][j])) {
                isWinningCombo = false;
                break;
            }
        }
        if (isWinningCombo) {
            gameWon = { index: i, player: player }
            break;
        }
    }
    return gameWon
}

function gameOver(gameWon) {
    for (let i of winCombos[gameWon.index]) {
        document.getElementById(i).style.backgroundColor =
            gameWon.player === have ? "rgba(31, 71, 38, 0.585)" : "rgba(190, 77, 77, 0.43)";
    }
    for (let i = 0; i < cells.length; i++) {
        cells[i].removeEventListener('click', turnClick);
    }
    declareWinner(gameWon.player === have ? `you won` :
        `you lose`);
}

function declareWinner(who) {
    document.querySelector(".endgame").style.display = "block";
    document.querySelector(".endgame .text").innerHTML = who;
}

function emptySquares() {
    return origBoard.filter((elm, i) => i === elm);
}

function checkTie() {
    if (emptySquares().length === 0) {
        for (let cell of cells) {
            cell.style.backgroundColor = "rgba(191, 170, 170, 0.131)";
            cell.removeEventListener('click', turnClick, false);
        }
        declareWinner(`tie game`);
        return true;
    }
    return false;
}




