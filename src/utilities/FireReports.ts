import { addDoc, collection, serverTimestamp } from "firebase/firestore"
import { db } from "./firebase"

export default class FireReports {

    static async createReport(targetId: string, targetCollectionName: string, probremIndex: number, detail: string): Promise<string | null> {

        const detailMax = 300

        if (detail.length === 0 || detail.length > detailMax) {
            return null
        }

        const probrems = ["暴力的", "センシティブ", "スパム", "事実に反する"]

        const probrem = probrems[probremIndex]

        try {

            const ref = await addDoc(collection(db, "reports"), {
                createdAt: serverTimestamp(),
                targetId: targetId,
                in: targetCollectionName,
                probrem: probrem,
                detail: detail
            })

            // console.log("Added 1 Report.")

            return ref.id

        } catch (error) {

            return null
        }
    }
}