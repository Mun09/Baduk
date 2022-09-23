import {useEffect, useState} from "react";
import useFetch from "../hooks/useFetch";

export default function ScoreBoard(props) {

    const [whitescore, setwhitescore] = useState(0);
    const [blackscore, setblackscore] = useState(0);
    const [whiteplayer, setwhiteplayer] = useState([]);
    const [blackplayer, setblackplayer] = useState([]);

    useEffect(() => {
        fetch(`http://localhost:3001/games/${props.id}`).then(res =>{
            return res.json();
        }).then(data => {
            setwhiteplayer(data.whiteplayer);
            setblackplayer(data.blackplayer);
            setwhitescore(data.whitescore);
            setblackscore(data.blackscore);
        })
    }, [whitescore, blackscore, props.id]);

    return (
        <>
            <table>
            <tbody>
                <tr>
                    <td>{blackplayer}이 잡은 돌 수: </td>
                    <td> {blackscore} </td>
                </tr>
                <tr>
                    <td>{whiteplayer}이 잡은 돌 수: </td>
                    <td> {whitescore} </td>
                </tr>
            </tbody>
            </table>
        </>
    );
}