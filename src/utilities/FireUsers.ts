import User from "../entities/User"
import { QueryDocumentSnapshot, DocumentData, getDocFromCache, getDocFromServer, getDoc, query, collection, where, getDocs, getDocsFromCache, getDocsFromServer, orderBy, startAt, endAt, limit, setDoc, serverTimestamp, updateDoc, arrayUnion, arrayRemove, DocumentSnapshot, documentId } from "firebase/firestore"
import { doc } from "firebase/firestore"
import { db } from "./firebase"
import FireAuth from "./FireAuth"
import ExString from "./ExString"

export default class FireUsers {

    static toUser(document: QueryDocumentSnapshot<DocumentData>): User {

        const id: string = document.id ?? ""

        const userTag: string = document.data().userTag ?? ""
        const displayName: string = document.data().displayName ?? ""
        const introduction: string = document.data().introduction ?? ""

        const iconUrl: string = document.data().iconUrl
        const likedCommentIds: string[] = document.data().likedCommentIds ?? []
        const mutedUserIds: string[] = document.data().mutedUserIds ?? []

        const user: User = { id: id, userTag: userTag, displayName: displayName, introduction: introduction, iconUrl: iconUrl, likedCommentIds: likedCommentIds, mutedUserIds }
        return user
    }

    static toUserFromDocumentSnapshot(document: DocumentSnapshot<DocumentData>) {

        const id: string = document.id ?? ""

        const userTag: string = document.get("userTag") ?? ""
        const displayName: string = document.get("displayName") ?? ""
        const introduction: string = document.get("introduction") ?? ""

        const iconUrl: string = document.get("iconUrl")
        const likedCommentIds: string[] = document.get("likedCommentIds") ?? []
        const mutedUserIds: string[] = document.get("mutedUserIds") ?? []

        const user: User = { id: id, userTag: userTag, displayName: displayName, introduction: introduction, iconUrl: iconUrl, likedCommentIds: likedCommentIds, mutedUserIds }
        return user
    }

    static async readUserFromCache(userId: string): Promise<User | null> {

        const docRef = doc(db, "users", userId)

        try {

            // ?????????????????????????????????
            const docSnapFromCache = await getDocFromCache(docRef)

            // ??????
            if (!docSnapFromCache.exists()) {
                return null
            }

            //??????
            return this.toUser(docSnapFromCache)

        } catch (e) {

            try {

                // ??????????????????????????????
                const docSnapFromServer = await getDocFromServer(docRef)

                // ??????
                if (!docSnapFromServer.exists()) {
                    return null
                }

                // ??????
                return this.toUser(docSnapFromServer)

            } catch (error) {

                console.log(`User reading failed. ${error}`)
                return null
            }
        }
    }

    static async readUser(userId: string): Promise<User | null> {

        const docRef = doc(db, "users", userId)

        try {

            const docSnap = await getDoc(docRef)

            // ??????
            if (!docSnap.exists()) {
                return null
            }

            // ??????
            return this.toUser(docSnap)

        } catch (error) {

            // ??????
            console.log(`User reading failed. ${error}`)
            return null
        }
    }

    static async readUsers(userIds: string[]): Promise<User[] | null> {

        if (userIds.length === 0) return []
        if (userIds.length > 10) return null

        const q = query(collection(db, "users"), where(documentId(), "in", userIds), limit(9999))

        try {

            // ????????????or?????????????????????????????????
            const querySnapshot = await getDocs(q)

            // ??????
            // ??????users
            let users: User[] = []
            querySnapshot.forEach((doc) => {
                const user = this.toUser(doc)
                users.push(user)
            })

            return users

        } catch (error) {

            // ??????
            console.log(`Users reading failed. ${error}`)
            return null
        }
    }

    static async readLikedUsersFromCache(commentId: string): Promise<User[] | null> {

        const q = query(collection(db, "users"), where("likedCommentIds", "array-contains", commentId), limit(9999))

        try {

            // ?????????????????????????????????
            const querySnapshot = await getDocsFromCache(q)

            // ??????
            // ??????users
            let users: User[] = []
            querySnapshot.forEach((doc) => {
                const user = this.toUser(doc)
                users.push(user)
            })

            return users

        } catch (error) {

            try {
                // ??????????????????????????????
                const querySnapshot = await getDocsFromServer(q)

                // ??????
                // ??????users
                let users: User[] = []
                querySnapshot.forEach((doc) => {
                    const user = this.toUser(doc)
                    users.push(user)
                })

                return users

            } catch (error) {

                // ??????
                console.log(`Users reading failed. ${error}`)
                return null
            }
        }
    }

    static async readLikedUsers(commentId: string): Promise<User[] | null> {

        const q = query(collection(db, "users"), where("likedCommentIds", "array-contains", commentId), limit(9999))

        try {

            // ????????????or?????????????????????????????????
            const querySnapshot = await getDocs(q)

            // ??????
            // ??????users
            let users: User[] = []
            querySnapshot.forEach((doc) => {
                const user = this.toUser(doc)
                users.push(user)
            })

            return users

        } catch (error) {

            // ??????
            console.log(`Users reading failed. ${error}`)
            return null
        }
    }

    static async readUsersByKeyword(keyword: string): Promise<User[] | null> {

        const q = query(collection(db, "users"), orderBy("displayName"), startAt(keyword), endAt(keyword + '\uf8ff'), limit(50))

        try {

            // ???????????? / ?????????????????????????????????
            const querySnapshot = await getDocs(q)

            // ??????
            // Users
            let users: User[] = []
            querySnapshot.forEach((doc) => {
                const thread = this.toUser(doc)
                users.push(thread)
            })

            return users

        } catch (error) {

            // ??????
            console.log(`Users reading failed. ${error}`)
            return null
        }
    }

    static async readIsUserTagDuplicate(userTag: string): Promise<boolean | null> {

        const uid = FireAuth.uid()
        if (uid === null) {
            return null
        }

        const q = query(collection(db, "users"), where("userTag", "==", userTag))

        try {
            // ??????????????????????????????
            const querySnapshot = await getDocsFromServer(q)

            // ??????
            // Users
            let users: User[] = []
            querySnapshot.forEach((doc) => {
                const thread = this.toUser(doc)
                users.push(thread)
            })

            let usersWithoutMe: User[] = []
            users.forEach((user) => {
                const userId = user.id
                if (userId !== uid) {
                    usersWithoutMe.push(user)
                }
            })

            if (usersWithoutMe.length > 0) {
                return true
            } else {
                return false
            }

        } catch (error) {

            // ??????
            console.log(`Users reading failed. ${error}`)
            return null
        }
    }

    static async readMutedUserIds(): Promise<string[] | null> {

        // ?????????????????????????????????
        const uid = FireAuth.uid()
        if (!uid) return null

        // ???????????????????????????????????????ID?????????
        const user = await this.readUser(uid)
        if (!user) return null

        return user.mutedUserIds
    }

    static async readMutedUsers(): Promise<User[] | null> {

        // UID
        const uid = FireAuth.uid()
        if (!uid) return null

        // User
        const user = await this.readUser(uid)
        if (!user) return null

        // Muted Users
        const mutedUsers = await this.readUsers(user.mutedUserIds)
        if (!mutedUsers) return null

        return mutedUsers
    }

    static async createUser(uid: string, displayName: string): Promise<string | null> {

        const displayNameMax = 30

        if (displayName.length === 0 || displayName.length > displayNameMax) {
            return null
        }

        try {

            await setDoc(doc(db, "users", uid), {
                createdAt: serverTimestamp(),
                displayName: displayName,
                userTag: ExString.randomText()
            })

            return uid

        } catch (error) {

            console.log(`Failed to User creation. ${error}`)
            return null
        }
    }

    static async updateUser(displayName: string, userTag: string, introduction: string, iconUrl: string | null): Promise<string | null> {

        const displayNameMax = 30
        const userTagMax = 30
        const introductionMax = 300

        // displayName???????????????
        if (displayName.length === 0 || displayName.length > displayNameMax) {
            return null
        }

        // userTag????????????????????????
        if (!userTag.match(/^\w{5,}$/)) {
            return null
        }

        if (userTag.length < 2 || userTag.length > userTagMax) {
            return null
        }

        // userTag????????????????????????
        const isUserTagDuplicate = await FireUsers.readIsUserTagDuplicate(userTag)

        if (isUserTagDuplicate === null) {
            alert("????????????????????????????????????????????????????????????")
            return null
        }

        if (isUserTagDuplicate) {
            alert("????????????????????????????????????????????????????????????")
            return null
        }

        // introduction?????????
        if (introduction.length > introductionMax) {
            return null
        }

        // ?????????????????????????????????
        const uid = FireAuth.uid()
        if (uid === null) {

            return null
        }

        // User???????????????????????????
        const ref = doc(db, "users", uid)

        try {

            await updateDoc(ref, {
                displayName: displayName,
                userTag: userTag,
                introduction: introduction,
                iconUrl: iconUrl
            })

            return uid

        } catch (error) {

            console.log(`Failed to update User. ${error}`)
            return null
        }
    }

    static async likeComment(commentId: string): Promise<string | null> {

        // ?????????????????????????????????????????????
        const uid = FireAuth.uid()

        if (uid === null) {
            return null
        }

        const ref = doc(db, "users", uid)

        try {

            await updateDoc(ref, {
                likedCommentIds: arrayUnion(commentId)
            })

            return uid

        } catch (error) {

            console.log(`Failed to update User. ${error}`)
            return null
        }
    }

    static async unlikeComment(commentId: string): Promise<string | null> {

        // ?????????????????????????????????????????????
        const uid = FireAuth.uid()

        if (uid === null) {
            return null
        }

        const ref = doc(db, "users", uid)

        try {

            await updateDoc(ref, {
                likedCommentIds: arrayRemove(commentId)
            })

            return uid

        } catch (error) {

            console.log(`Failed to update User. ${error}`)
            return null
        }
    }

    static async muteUser(userId: string): Promise<string | null> {

        // UID
        const uid = FireAuth.uid()
        if (!uid) return null

        // Document Reference
        const ref = doc(db, "users", uid)

        // Update document
        try {

            await updateDoc(ref, {
                mutedUserIds: arrayUnion(userId)
            })

            return uid

        } catch (error) {

            console.log(`Failed to update User. ${error}`)
            return null
        }
    }

    static async unmuteUser(userId: string): Promise<string | null> {

        // UID
        const uid = FireAuth.uid()
        if (!uid) return null

        // Document Reference
        const ref = doc(db, "users", uid)

        // Update document
        try {

            await updateDoc(ref, {
                mutedUserIds: arrayRemove(userId)
            })

            return uid

        } catch (error) {

            console.log(`Failed to update User. ${error}`)
            return null
        }
    }
}