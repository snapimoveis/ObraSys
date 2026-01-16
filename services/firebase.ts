import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDORPLYzU6Zscj4yIJpI3AuGjeZm1JQPSY",
  authDomain: "obrasys.firebaseapp.com",
  projectId: "obrasys",
  storageBucket: "obrasys.firebasestorage.app",
  messagingSenderId: "230446697300",
  appId: "1:230446697300:web:a70b511f88485df2f0d6c1",
  measurementId: "G-KQCP53NF8Z"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

/**
 * @deprecated Utilize o useSession() hook para obter o companyId de forma segura e reativa.
 */
export const getCurrentCompanyId = () => {
  return localStorage.getItem('obrasys_company_id');
};