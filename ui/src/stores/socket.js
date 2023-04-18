// create a websocket svelte store 

// import { writable } from "svelte/store";
import { get } from 'svelte/store';
import { notebook, cells, id_map, append_output } from "./notebook";

export let socket = null;

export async function open_socket() {
    console.log("Opening socket");
    if (socket === null) {
        socket = new WebSocket("ws://localhost:8000/");
        socket.onopen = async function (event) {
            while (socket.readyState !== WebSocket.OPEN) {
                console.log("Waiting for socket to open");
                await new Promise(r => setTimeout(r, 100));

            }
            socket.send(JSON.stringify({
                "channel": "notebook",
                "method": "get",
            }));
            console.log("Socket opened");
        };
        socket.onclose = function (event) {
            console.log("Socket closed");
            socket = null;
        }
        socket.onmessage = function (event) {
            console.log("received : ", JSON.parse(event.data));
            let data = JSON.parse(event.data);
            let channel = data["channel"];
            let method = data["method"];
            let message = data["message"];

            if (data["channel"] === "notebook") {
                notebook[method](message);
            }

        };
    }
};

export async function send_message({ channel, method, message }) {
    console.log("send : ", { channel, method, message });
    socket.send(JSON.stringify({
        "channel": channel,
        "method": method,
        "message": message
    }));
}