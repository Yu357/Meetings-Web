import { collection, onSnapshot, query, where } from "firebase/firestore"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { db } from "../../utilities/firebase"
import FireComment from "../../utilities/FireComment"
import Comment from "../../types/Comment"
import CommentRow from "../parts/CommentRow"
import Thread from "../../types/Thread"
import FireThread from "../../utilities/FireThread"

export default function ThreadScreen() {

    document.title = 'Thread - Meetings'

    const { threadId } = useParams()
    const [thread, setThread] = useState<Thread | null>(null)
    const [comments, setComments] = useState<Comment[]>([])

    async function readThread() {
        if (threadId !== undefined) {
            const thread = await FireThread.readThreadFromCache(threadId)
            setThread(thread)
        }
    }

    async function startReadingComments() {
        const q = query(collection(db, "comments"), where("threadId", "==", threadId))
        onSnapshot(q, (querySnapshot) => {

            let comments: Comment[] = []
            querySnapshot.forEach((doc) => {
                const comment = FireComment.toComment(doc)
                comments.push(comment)
            })

            setComments(comments)
        })
    }

    useEffect(() => {
        readThread()
        startReadingComments()
        // eslint-disable-next-line
    }, [])

    return (
        <div>
            <div className='p-2 border-b border-zinc-200 dark:border-zinc-800 sticky top-0 bg-white dark:bg-black'>
                <span className='font-bold text-lg'>{thread !== null ? thread.title : threadId}</span>
            </div>

            <div>
                {comments.map((comment) => (
                    <CommentRow comment={comment}/>
                ))}
            </div>
        </div>
    )
}