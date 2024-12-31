import React, { useState, useEffect } from "react";
import style from "./Representatives.module.css";
import { fetchRepresentatives, inviteRepresentative } from "../../services/representatives";
import { userDetailsStore } from "@/app/services/zustand";
import { showError, showSuccess } from "@/app/services/messeges";
import { useRouter } from "next/navigation";
import { isValidEmail } from "@/app/services/validations";


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
    const [companyId, setCompanyId] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const { userDetails } = userDetailsStore();
    // const companyId = localStorage.getItem("companyId");
    const router = useRouter();

    useEffect(() => {
        const storedCompanyId = localStorage.getItem("companyId");
        setCompanyId(storedCompanyId);
        console.log(companyId);
        if (!companyId) {
            showError("שגיאה בשליפת הנציגים מהמערכת. אנא התחבר שוב כמנהל.");
            router.push("/login");
        }
        console.log(companyId);

        const fetchData = async () => {
            setLoading(true);
            try {
                const data = await fetchRepresentatives(companyId);
                setRepresentatives(data);
            } catch (error: any) {
                showError("שגיאה בשליפת הנציגים מהמערכת. אנא נסה שוב מאוחר יותר.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [userDetails.company_id]);

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
            showError("יש להזין כתובת מייל");
            return;
        }
        if (!inviteName) {
            showError("יש להזין שם נציג");
            return;
        }
        if (!isValidEmail(inviteEmail)) {
            showError("כתובת מייל לא תקינה");
            return;
        }

        setLoading(true);
        try {
            const newRepresentative = await inviteRepresentative(inviteEmail, inviteName, companyId || "");
            setInviteEmail("");
            setInviteName("");
            setIsInviteRepresentative(false);
            showSuccess("הנציג הוזמן בהצלחה!");
            setRepresentatives((prev) => [...prev, newRepresentative]);

        } catch (error: any) {
            if (error.response?.status === 409 && error.response?.data?.message.includes("כבר קיימת")) {
                showError("כתובת המייל כבר קיימת במערכת.");
                return;
            } else {
                showError("התרחשה שגיאה בלתי צפויה.");
                return;
            }
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
                    </div>) :
                    isInviteRepresentative && (
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
                    )}

            </div>

            <button className={style.newInviteButton} onClick={handleInvite}>
                הזמן נציג חדש
            </button>
        </div>
    );
};
