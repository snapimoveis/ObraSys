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

// Helper para obter o ID da empresa do utilizador atual
// Assumimos que o Login guardou isto no localStorage para evitar chamadas repetidas
export const getCurrentCompanyId = () => {
  return localStorage.getItem('obrasys_company_id');
};