import React, { useState } from "react";
import style from "./Representatives.module.css";

interface Representative {
    id: number;
    name: string;
    status: "active" | "inactive" | "invited";
    email: string;
    phone: string;
}

export const Representatives = () => {
    const [isInviteRepresentative, setIsInviteRepresentative] = useState(false);
    const [selectedRepresentative, setSelectedRepresentative] = useState<Representative | null>(null);
    const [representatives, setRepresentatives] = useState<Representative[]>([
        { id: 1, name: "מאיה", status: "active", email: "maya@example.com", phone: "050-1234567" },
        { id: 2, name: "שמעון", status: "active", email: "shimon@example.com", phone: "050-9876543" },
        { id: 3, name: "גדי", status: "inactive", email: "gadi@example.com", phone: "050-5555555" },
        { id: 4, name: "חן", status: "invited", email: "hen@example.com", phone: "050-7777777" },
    ]);

    const handleInvite = () => {
        setIsInviteRepresentative(true); 
        setSelectedRepresentative(null); 
    };

    const handleRepresentativeClick = (rep: Representative) => {
        setSelectedRepresentative(rep); 
        setIsInviteRepresentative(false); 
    };

    return (
        <div className={style.container}>
            <h2 className={style.title}>ניהול נציגים</h2>

            <div className={style.content}>
                <div className={style.representativesList}>
                    {representatives.map((rep) => (
                        <div 
                            key={rep.id} 
                            className={style.repCard} 
                            onClick={() => handleRepresentativeClick(rep)}
                        >
                            <span className={style.repName}>{rep.name}</span>
                            <div
                                className={`${style.statusDot} ${rep.status === "active"
                                    ? style.active
                                    : rep.status === "inactive"
                                        ? style.inactive
                                        : style.invited
                                    }`}
                            ></div>
                        </div>
                    ))}
                </div>

                {selectedRepresentative ? (
                    <div className={style.detailsPanel}>
                        <h3>פרטי נציג</h3>
                        <p><strong>שם:</strong> {selectedRepresentative.name}</p>
                        <p><strong>מייל:</strong> {selectedRepresentative.email}</p>
                        <p><strong>טלפון:</strong> {selectedRepresentative.phone}</p>
                    </div>
                ) : isInviteRepresentative ? (
                    <div className={style.inviteBox}>
                        <input
                            type="email"
                            placeholder="כתובת מייל נציג"
                            className={style.input}
                        />
                        <button className={style.sendInviteButton}>שלח הזמנה</button>
                    </div>
                ) : null}
            </div>

            <button className={style.newInviteButton} onClick={handleInvite}>
                הזמן נציג חדש
            </button>
        </div>
    );
};
