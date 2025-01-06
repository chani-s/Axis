"use client"

import { gprovider } from './firebase-config';
import { getAuth, signInWithPopup} from "firebase/auth";

export function googleSignup(): Promise<any> {
    return signInWithPopup(getAuth(), gprovider)
       .then((result:any) => {
        console.log(result);
        return result;
       });        
}