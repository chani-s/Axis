import React from "react";
import style from "./Representatives.module.css";
import { userDetailsStore } from "@/app/services/zustand";
import { useRepresentatives } from "./useRepresentatives";
import { FaArrowRight, FaSpinner } from "react-icons/fa";
import Link from "next/link";

export const Representatives = () => {
    const { userDetails } = userDetailsStore();
    const companyId = localStorage.getItem("companyId") || userDetails.company_id;
    const companyLogo = localStorage.getItem("companyLogo");

    const {
        representatives,
        loading,
        isInviteRepresentative,
        selectedRepresentative,
        inviteEmail,
        inviteName,
        setInviteEmail,
        setInviteName,
        setSelectedRepresentative,
        setIsInviteRepresentative,
        handleInviteSubmit,
    } = useRepresentatives(companyId || "", companyLogo);

    const handleInvite = () => {
        setIsInviteRepresentative(true);
        setSelectedRepresentative(null);
    };

    const handleRepresentativeClick = (rep: any) => {
        setSelectedRepresentative(rep);
        setIsInviteRepresentative(false);
    };

    return (
        <div>
            <Link className={style.backLink} href="/chat/manager"><FaArrowRight /> </Link>

            <div className={style.container}>
                <h2 className={style.title}>ניהול נציגים</h2>
                <p className={style.repTitle}>הנציגים שלך:</p>
                <div className={style.content}>
                    <div className={style.representativesList}>
                        {loading ? (<FaSpinner className={style.spinner} />
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

