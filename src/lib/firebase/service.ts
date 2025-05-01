import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import app from "./init";
import bcrypt from "bcrypt";
import { UserWithPassword } from "@/app/types/user";

const firestore = getFirestore(app);

export async function retrieveData(collectionName: string) {
  const snapshot = await getDocs(collection(firestore, collectionName));
  const data = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return data;
}

export async function retrieveDataById(collectionName: string, id: string) {
  const snapshot = await getDoc(doc(firestore, collectionName, id));
  const data = snapshot.data();
  return data;
}

export async function signUp(userData: {
  email: string;
  fullname: string;
  phone: string;
  password: string;
  role?: string;
}): Promise<boolean> {
  try {
    const q = query(
      collection(firestore, "users"),
      where("email", "==", userData.email)
    );
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      return false;
    }

    const role = userData.role || "member";
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    await addDoc(collection(firestore, "users"), {
      email: userData.email,
      fullname: userData.fullname,
      phone: userData.phone,
      password: hashedPassword,
      role: role,
    });

    return true;
  } catch (error) {
    console.error("Gagal register:", error);
    return false;
  }
}

export async function signIn(email: string) {
  try {
    const q = query(
      collection(firestore, "users"),
      where("email", "==", email)
    );

    const snapshot = await getDocs(q);
    const userDoc = snapshot.docs[0];

    if (!userDoc) return null;

    return {
      id: userDoc.id,
      ...userDoc.data(),
    } as UserWithPassword;
  } catch (error) {
    console.error("Login error:", error);
    return null;
  }
}
