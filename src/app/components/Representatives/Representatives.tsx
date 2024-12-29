import React, { useState, useEffect } from "react";
import style from "./Representatives.module.css";
import { fetchRepresentatives, inviteRepresentative } from "../../services/representatives";
import { userDetailsStore } from "@/app/services/zustand";

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
    const [representatives, setRepresentatives] = useState<Representative[]>([]);
    const [inviteEmail, setInviteEmail] = useState<string>("");
    const [inviteName, setInviteName] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const userDetails = userDetailsStore((state) => state.userDetails);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await fetchRepresentatives();
                setRepresentatives(data);
            } catch (error: any) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleInvite = () => {
        setIsInviteRepresentative(true);
        setSelectedRepresentative(null);
    };

    const handleRepresentativeClick = (rep: Representative) => {
        setSelectedRepresentative(rep);
        setIsInviteRepresentative(false);
    };

    const handleInviteSubmit = async () => {
        if (!inviteEmail) {
            setError("Email is required");
            return;
        }
        if (!inviteName) {
            setError("Name is required");
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const newRepresentative = await inviteRepresentative(inviteEmail, inviteName, userDetails.company_id||""); // Set to manager's company ID
            setRepresentatives((prev) => [...prev, newRepresentative]);
            setInviteEmail("");
            setInviteName("");
            setIsInviteRepresentative(false);
        } catch (error: any) {
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={style.container}>
            <h2 className={style.title}>ניהול נציגים</h2>
            <p className={style.repTitle}>הנציגים שלך:</p>
            <div className={style.content}>
                <div className={style.representativesList}>
                    {loading ? (
                        <p>Loading...</p>
                    ) : error ? (
                        <p style={{ color: "red" }}>{error}</p>
                    ) : (
                        representatives.map((rep) => (
                            <div
                                key={rep.id}
                                className={style.repCard}
                                onClick={() => handleRepresentativeClick(rep)}
                            >
                                <p>{rep.name}</p>
                                <div
                                    className={`${style.statusDot} ${rep.status === "active"
                                        ? style.active
                                        : rep.status === "inactive"
                                        ? style.inactive
                                        : style.invited
                                    }`}
                                ></div>
                            </div>
                        ))
                    )}
                </div>

                {selectedRepresentative ? (
                    <div className={style.detailsPanel}>
                        <h3>פרטי נציג</h3>
                        <p>{selectedRepresentative.name}</p>
                        <p>{selectedRepresentative.email}</p>
                        <p>{selectedRepresentative.phone}</p>
                    </div>
                ) : isInviteRepresentative ? (
                    <div className={style.inviteBox}>
                        <input
                            type="name"
                            value={inviteName}
                            onChange={(e) => setInviteName(e.target.value)}
                            placeholder="שם נציג"
                            className={style.input}
                        />
                        <input
                            type="email"
                            value={inviteEmail}
                            onChange={(e) => setInviteEmail(e.target.value)}
                            placeholder="כתובת מייל נציג"
                            className={style.input}
                        />
                        <button
                            className={style.sendInviteButton}
                            onClick={handleInviteSubmit}
                            disabled={loading}
                        >
                            {loading ? "שליחה..." : "שלח הזמנה"}
                        </button>
                    </div>
                ) : null}
            </div>

            <button className={style.newInviteButton} onClick={handleInvite}>
                הזמן נציג חדש
            </button>
        </div>
    );
};
