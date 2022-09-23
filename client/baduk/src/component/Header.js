import styles from "../css/Header.module.css";
import { Link } from "react-router-dom";

export default function Header() {
    return (
        <>
            <Link style={{textDecoration: 'none'}} to="/"><p className={styles.title}>[바둑월드]</p></Link>
        </>
    )
}