import { addDoc, collection, serverTimestamp } from "firebase/firestore"
import type { Firestore } from "firebase/firestore"

type AuditPayload = {
  action: string
  actorUid: string
  actorName?: string | null
  target?: string
  metadata?: Record<string, unknown>
}

export async function addAuditLog(db: Firestore, payload: AuditPayload) {
  await addDoc(collection(db, "auditLogs"), {
    ...payload,
    createdAt: serverTimestamp(),
  })
}
