import React from "react";
import style from "./DetailsPopUp.module.css"

export const DetailsPopUp = () => {

    const [address, setAddress] = React.useState("");
    const [fullName, setFullName] = React.useState("");
    const [isLoadding, setIsLoading] = React.useState(false);

    const handleSubmit = (e: any) => {
        e.preventDefault();
        // submit data to server
        console.log("Form submitted with address:", address, "fullName:", fullName);
    };

    return (
        <>
            {!isLoadding && (
                <form onSubmit={handleSubmit} className={style.container}>
                    <h2 className={style.title}>
                        בוא נכיר קצת יותר                    </h2>
                    <div className={style.inputContainer}>
                        <input
                            type="address"
                            placeholder="כתובת"
                            className={style.input}
                            onChange={(e) => setAddress(e.target.value)}
                            title="אנא הכנס כתובת אימייל תקינה"
                            required
                            pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
                        />
                        <input
                            type="name"
                            placeholder="שם מלא"
                            className={style.input}
                            onChange={(e) => setFullName(e.target.value)}
                            title="שם כמו בתעודת הזהות"
                        />
                       
                    </div>
                    
                </form>
            )}
        </>
    );
};
