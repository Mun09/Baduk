import styles from "../css/Hello.module.css";
import { useParams } from "react-router-dom";
import { useState, useRef } from "react";

import ScoreBoard from "./Scoreboard";
import Badukpan from "./Badukpan";
import useFetch from "../hooks/useFetch";

export default function Daeguk(props) {
    const params = new URLSearchParams(window.location.search);
    const game_id = params.get("id");
    const player1 = useRef(null);
    const player2 = useRef(null);
    const dol_color = useRef(null);
    const [playeron, playeronset] = useState(false);
    // const exist_game_data = useFetch('http://localhost:3001/games').filter(function(e) {
    //     return e.id === game_id;
    // });
    // const alreay_exist = exist_game_data.length;

    function onSubmit(e) {
        e.preventDefault();

        var arr = new Array(19 + 1).fill(-1).map(() => new Array(19 + 1).fill(-1));
        fetch(`http://localhost:3001/games/`, {
            method: "POST",
            headers: {
                "Content-Type" : "application/json",
            },
            body: JSON.stringify({
                "id" : game_id,
                "blackplayer" : player1.current.value,
                "whiteplayer" : player2.current.value,
                "blackscore" : 0,
                "whitescore" : 0,
                "pan" : arr,
            }),
        })
        .then(res => {
            console.log(res.ok);
        });

        playeronset(true);
    }

    return (
        <>
            <fieldset className={styles.pan}>
                <legend className={styles.title}>바둑판</legend>
                {
                    playeron === true ? <Badukpan id={game_id} dol_color={dol_color.current.value} /> : null
                }
                <form onSubmit={onSubmit}>
                    <center>
                        <input type="text" placeholder="black_player" ref={player1}></input>
                        <input type="text" placeholder="white_player" ref={player2}></input>
                        <input type="text" placeholder="dol color" ref={dol_color}></input>
                        <button>시작</button>
                    </center>
                </form>
                {
                    playeron === true ? <ScoreBoard id={game_id} /> : null
                }
                

            </fieldset>
        </>
    )
}