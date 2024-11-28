import React from "react";
import styles from "./SideBar.module.css"

const SideBar = () =>{
    return (
        <div className={styles.sideBar}>
            <div className={styles.inputs}>
                <input className={styles.input} type="text" placeholder="חיפוש חברה חדשה..."/>
                <input className={styles.input} type="text" placeholder=" חפש בצאטים..." />
                הצאטים שלך
            </div>
        </div>
    )
}

export default SideBar;