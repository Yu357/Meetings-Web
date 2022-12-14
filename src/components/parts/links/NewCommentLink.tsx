import { onAuthStateChanged } from "firebase/auth"
import { useEffect, useState } from "react"
import { AiOutlinePlus } from "react-icons/ai"
import { Link, useLocation } from "react-router-dom"
import FireAuth from "../../../utilities/FireAuth"
import { auth } from "../../../utilities/firebase"

function NewCommentLink(props: { threadId: string, className?: string }) {

    const location = useLocation()
    const [uid, setUid] = useState<string | null>(FireAuth.uidFromLocalStorage())

    useEffect(() => {

        onAuthStateChanged(auth, (user) => {
            if (user) {

                const uid = user.uid
                setUid(uid)

            } else {

                setUid(null)
            }
        })
    }, [])

    return (
        <div className={`z-10 ${props.className}`}>

            {uid !== null &&

                <Link to={`/threads/${props.threadId}/new`} state={{ previousPath: location.pathname }}>

                    <div className="p-2 rounded-full transition hover:bg-gray-100 dark:hover:bg-gray-900">

                        <AiOutlinePlus className="text-2xl" />
                    </div>
                </Link>
            }
        </div>
    )
}

export default NewCommentLink