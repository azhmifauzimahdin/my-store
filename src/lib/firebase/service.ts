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
