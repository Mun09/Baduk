import styles from "../css/Main.module.css";
import { Link } from "react-router-dom";
import { useState, useRef } from "react";
import useFetch from "../hooks/useFetch";
import useAsync from "../hooks/useAsync";
import { useNavigate } from "react-router";

async function get_next_game_id() {
    const response = await fetch(`http://localhost:3001/data`);
    return response.json();
}

export default function Main() {
    const [state, refetch] = useAsync(get_next_game_id, []);
    const { loading, data: game_data, error } = state;
    const goingto = useRef(null);
    const navigate = useNavigate();

    if(loading) return <div>Loading...</div>
    if(error) return <div>ERROR</div>
    if(!game_data) return <button onClick={refetch}>불러오기</button>;

    const next_game_id = game_data.next_game_id;

    function onSubmit(e) {
        e.preventDefault();
    
        const user_goingto = Number(goingto.current.value);
        const body_data = {"next_game_id" : (next_game_id === user_goingto ? next_game_id + 1 : next_game_id)};
    
        fetch(`http://localhost:3001/data`, {
            method: "PATCH",
            headers: {
                "Content-Type" : "application/json",
            },
            body: JSON.stringify(body_data),
        })
        .then(res => {
            console.log(res.ok);
        });
        window.location.href = `daeguk?id=${user_goingto}`;
    }

    return (
        <div className={styles.d}>
            <div>
                <p>심심한데... 바둑이나 둘까??</p>
                <p>랜덤한 상대방과 대국할 수 있는 바둑월드에 오신걸 환영합니다!</p>
            </div>
            
            <form>
                <label>방번호 </label>
                <input type="number" min="1" max={next_game_id} id={styles.goingto} ref={goingto}></input>
                <button onClick={onSubmit}><p> [해당 대국장으로 이동] </p></button>
            </form>
            <button onClick={refetch}>다시 불러오기</button>
        </div>
    )
}