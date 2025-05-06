import { addData, retrieveDataByField } from "@/lib/firebase/service";
import { UserWithPassword } from "@/types/user";
import bcrypt from "bcrypt";

export async function signUp(userData: {
  email: string;
  fullname: string;
  phone: string;
  password: string;
  role?: string;
  created_at: Date;
  updated_at: Date;
}): Promise<boolean> {
  try {
    const snapshot = await retrieveDataByField(
      "users",
      "email",
      userData.email
    );

    if (!snapshot.empty) {
      return false;
    }

    userData.role = userData.role ?? "member";
    userData.password = await bcrypt.hash(userData.password, 10);
    userData.created_at = new Date();
    userData.updated_at = new Date();

    await addData("users", userData);

    return true;
  } catch (error) {
    console.error("Gagal register:", error);
    return false;
  }
}

export async function signIn(email: string) {
  try {
    const snapshot = await retrieveDataByField("users", "email", email);
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

export async function loginWithGoogle(data: {
  email: string;
  fullname: string;
  type: string;
}): Promise<any | null> {
  try {
    const snapshot = await retrieveDataByField("users", "email", data.email);
    const userDoc = snapshot.docs[0];

    if (userDoc) {
      return { id: userDoc.id, ...userDoc.data() };
    } else {
      const newUser = {
        ...data,
        role: "member",
        created_at: new Date(),
        updated_at: new Date(),
      };

      const res = await addData("users", newUser);
      return { id: res.id, ...newUser };
    }
  } catch (error) {
    console.error("Login with Google error:", error);
    return null;
  }
}
