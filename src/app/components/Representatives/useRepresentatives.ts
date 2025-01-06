import { useState, useEffect } from "react";
import Pusher from "pusher-js";
import { fetchRepresentatives, inviteRepresentative } from "@/app/services/representatives";
import { showError, showSuccess } from "@/app/services/messeges";
import { useRouter } from "next/navigation";
import { userDetailsStore } from "@/app/services/zustand";

export interface Representative {
    id: number;
    name: string;
    status: "active" | "inactive" | "invited";
    email: string;
    phone: string;
}

export const useRepresentatives = (companyId: string, companyLogo: string | null) => {
    const [representatives, setRepresentatives] = useState<Representative[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [isInviteRepresentative, setIsInviteRepresentative] = useState(false);
    const [selectedRepresentative, setSelectedRepresentative] = useState<Representative | null>(null);
    const [inviteEmail, setInviteEmail] = useState<string>("");
    const [inviteName, setInviteName] = useState<string>("");
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

        // Fetch representatives and setup Pusher
        const fetchData = async () => {
            setLoading(true);
            try {
                const data = await fetchRepresentatives(companyId || userDetails.company_id);
                setRepresentatives(data.filter((rep: Representative) => rep.name));
            } catch {
                showError("שגיאה בשליפת הנציגים מהמערכת. אנא נסה שוב מאוחר יותר.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();

        const pusher = new Pusher(process.env.PUSHER_KEY!, {
            cluster: process.env.PUSHER_CLUSTER!,
        });

        const channel = pusher.subscribe(`company-${companyId}`);

        channel.bind("status-updated", (updatedRep: Representative) => {
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
            pusher.unsubscribe(`company-${companyId}`);
        };
    }, [companyId]);

    // Handle invite representative
    const handleInviteSubmit = async () => {
        if (!inviteEmail) {
            showError("יש להזין כתובת מייל");
            return;
        }
        if (!inviteName) {
            showError("יש להזין שם נציג");
            return;
        }

        setLoading(true);
        try {
            const newRepresentative = await inviteRepresentative(
                inviteEmail,
                inviteName,
                companyId,
                companyLogo || ""
            );
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

    return {
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
    };
};
