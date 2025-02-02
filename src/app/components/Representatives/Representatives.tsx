import React, { useState, useEffect } from "react";
import Pusher from "pusher-js";
import style from "./Representatives.module.css";
import { fetchRepresentatives, inviteRepresentative } from "../../services/representatives";
import { userDetailsStore } from "@/app/services/zustand";
import { showError, showSuccess } from "@/app/services/messeges";
import { useRouter } from "next/navigation";
import { isValidEmail } from "@/app/services/validations";
import { FaArrowRight } from "react-icons/fa";
import Link from "next/link";

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
    const [companyLogo, setCompanyLogo] = useState<string>("");

    const [loading, setLoading] = useState<boolean>(false);
    const { userDetails, setUserDetails } = userDetailsStore();

    const router = useRouter();


    useEffect(() => {
        const user = localStorage.getItem("userDetails");
        let parsedUser = null;
        if (user) {
            parsedUser = JSON.parse(user);
            console.log("))))", parsedUser);
            setUserDetails(parsedUser);
        }
        const storedCompanyId = localStorage.getItem("companyId");
        const storedCompanyLogo = localStorage.getItem("companyLogo");

        if (!parsedUser.company_id || !storedCompanyLogo) {
            showError("שגיאה בשליפת הנציגים מהמערכת. אנא התחבר שוב כמנהל.");
            router.push("/login");
            return;
        }
        setCompanyId(parsedUser.company_id);
        setCompanyLogo(storedCompanyLogo);

        const fetchData = async () => {
            setLoading(true);
            try {
                const data = await fetchRepresentatives(parsedUser.company_id);
                console.log("Fetched representatives:", data);
                setRepresentatives(data.filter((rep: Representative) => rep.name));
            } catch (error: any) {
                showError("שגיאה בשליפת הנציגים מהמערכת. אנא נסה שוב מאוחר יותר.");
            } finally {
                setLoading(false);
            }
        };


        fetchData();

        const pusher = new Pusher(process.env.PUSHER_KEY, {
            cluster: process.env.PUSHER_CLUSTER,
        });


        const channel = pusher.subscribe(`company-${parsedUser.company_id}`);

        channel.bind("status-updated", (updatedRep: Representative) => {
            console.log("Updated representative from Pusher:", updatedRep);
            setRepresentatives((prev) =>
                prev.map((rep) =>
                    rep.id === updatedRep.id
                        ? { ...rep, status: updatedRep.status }
                        : rep
                )
            );
        });

        channel.bind("new-representative", (newRep: Representative) => {
            setRepresentatives((prev) => [...prev, newRep]);
        });

        return () => {
            channel.unbind("status-updated");
            channel.unbind("new-representative");
            pusher.unsubscribe(`company-${parsedUser.company_id}`);
        };
    }, [router]);

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
            const newRepresentative = await inviteRepresentative(inviteEmail, inviteName, companyId || "", companyLogo || "");
            if (newRepresentative && newRepresentative.name) {
                showSuccess("הנציג הוזמן בהצלחה!");
                setRepresentatives((prev) => [...prev, newRepresentative]);
                setIsInviteRepresentative(false);
            }
        } catch (error: any) {
            if (error.response?.status === 409 && error.response?.data?.message.includes("כבר קיימת")) {
                showError("כתובת המייל כבר קיימת במערכת.");
            } else {
                showError("התרחשה שגיאה בלתי צפויה.");
            }
        } finally {
            setInviteEmail("");
            setInviteName("");
            setLoading(false);
        }
    };

    return (
        <div>            
            <Link className={style.backLink} href="/chat/manager"><FaArrowRight /> </Link>

            <div className={style.container}>
                <h2 className={style.title}>ניהול נציגים</h2>
                <p className={style.repTitle}>הנציגים שלך:</p>
                <div className={style.content}>
                    <div className={style.representativesList}>
                        {loading ? (
                            <p>Loading...</p>
                        ) : representatives.length > 0 ? (
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
                            ))) : (
                            <p className={style.noRepresentativesMessage}>
                                אין לך נציגים להצגה כרגע :)
                            </p>
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
        </div>

    );
};
