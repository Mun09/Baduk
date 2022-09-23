import styles from "../css/Hello.module.css";
import { useEffect, useState} from "react";
import useFetch from "../hooks/useFetch";
import * as bfs from "./bfs.js";
import io from 'socket.io-client'

export default function Badukpan(props) {

    const [blackturn, changeturn] = useState(true);
    const [graph, set_graph] = useState([]);
    const [whitescore, setwhitescore] = useState(0);
    const [blackscore, setblackscore] = useState(0);
    const game_id = Number(props.id);
    console.log(game_id);

    const dols_data = useFetch(`http://localhost:3001/dols`);
    const arr1 = [1, -1, 0, 0], arr2 = [0, 0, 1, -1];
    const rows = 19, cols = 19;

    if(props.dol_color === "white") {changeturn(false);}

    useEffect(() => {
        fetch(`http://localhost:3001/games/${game_id}`).then( res => {
            return res.json();
        }).then(data => {
            set_graph(data.pan); // why twice loading when started?
        })
    }, [game_id]);

    useEffect(() => {
        fetch(`http://localhost:3001/games/${game_id}`).then( res => {
            return res.json();
        }).then(data => {
            setwhitescore(data.whitescore);
            setblackscore(data.blackscore);
        })
    }, [game_id]);

    // socket 
    const socket = io.connect("http://localhost:3002");

    const [room, setRoom] = useState(game_id);
    const [cords, setCords] = useState("");
    const [cordsReceived, setCordsReceived] = useState("");

    useEffect(() => {
        if(room !== "") {
            socket.emit("join_room", room);
        }
    }, [room]);

    useEffect(() => {
        socket.on("received_coordinates", (data) => {
            setCordsReceived(data.cords);
            doldraw(cordsReceived, !blackturn);
        });
        

    }, [socket]);

    const sendcords = () => {
        socket.emit("send_coordinates", {cords, room});
    };


    function doldraw(key, thisblackturn) {
        const [ix, iy] = key.split('-').map(e1 => Number(e1));
        const resultx = (ix - 1) * 33.3333;
        const resulty = (iy - 1) * 33.3333;

        var dol = document.createElement("div");
        dol.style.position = "absolute";
        dol.style.marginTop = resulty - 8 +'px';
        dol.style.marginLeft = resultx - 12 +'px';
        dol.style.height = "25px";
        dol.style.width = "25px";
        dol.style.background = thisblackturn === true ? "black" : "white";
        dol.style.borderRadius = "50%";
        dol.id = key;
        document.getElementById('dots').appendChild(dol);
        graph[ix][iy] = thisblackturn;
        let cnt =0;

        for(var i = 0; i < 4; i++) {
            var tx = arr1[i] + ix, ty = arr2[i] + iy;
            if (1 <= tx && tx <= rows && 1 <= ty && ty <= cols && graph[tx][ty] !== blackturn && graph[tx][ty] !== -1) {
                let [death, visited_node] = bfs.bfs(graph, [tx, ty]);
                if(death) {
                    cnt += visited_node.length;
                    console.log("death detected");
                    for(var j in visited_node) {
                        graph[visited_node[j][0]][visited_node[j][1]] = -1;
                        document.getElementById(visited_node[j][0]+"-"+visited_node[j][1]).remove();
                    }
                }
            }
        }

        let player = thisblackturn === true ? "blackscore" : "whitescore";
        const body_data = {
            "pan" : graph,
        }
        body_data[player] = (thisblackturn === true ? blackscore : whitescore) + cnt;

        fetch(`http://localhost:3001/games/${game_id}`, {
            method: "PATCH",
            headers: {
                "Content-Type" : "application/json",
            },
            body: JSON.stringify(body_data),
        }).then(() => {
            set_graph(graph);
            setblackscore(blackscore);
            setwhitescore(whitescore);
        });
        
    };

    function make_dot(e) {
        console.log("clicked");

        var rect = e.target.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        var key = null, result = null;

        for(var ob in dols_data){
            let [ix, iy] = ob.split('-').map(e1 => Number(e1));
            if( (Math.abs(Number(dols_data[ob].x) - x) < 15) && (Math.abs(Number(dols_data[ob].y) - y) < 15) && graph[ix][iy] === -1 ){
                result = dols_data[ob];
                key = ob;
                break;
            }
        }
        if(result === null) return null;

        setCords(ob);
        sendcords();

        doldraw(key, blackturn);
    };
    

    return (
        <>
            <div id="dots">
                <div id="daegukpan" className={`${styles.box} ${styles.grid}`} onClick={make_dot}>
                </div>
            </div>
        </>
    );
}