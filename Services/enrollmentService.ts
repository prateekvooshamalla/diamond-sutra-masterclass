import { db } from "@/Services/firebase"
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore"

const COURSE_ID = "diamond-sutra"

export function enrollmentDocId(uid: string) {
  return `${uid}_${COURSE_ID}`
}

export async function getEnrollment(uid: string) {
  const ref = doc(db, "enrollments", enrollmentDocId(uid))
  const snap = await getDoc(ref)
  return snap.exists() ? snap.data() : null
}

export async function activateEnrollment(uid: string) {
  const ref = doc(db, "enrollments", enrollmentDocId(uid))
  await setDoc(
    ref,
    {
      uid,
      courseId: COURSE_ID,
      status: "active",
      checkedInAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      createdAt: serverTimestamp(),
    },
    { merge: true }
  )
}