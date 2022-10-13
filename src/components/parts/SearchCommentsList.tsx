import { useEffect, useState } from "react"
import Comment from "../../entities/Comment"
import FireComments from "../../utilities/FireComments"
import progress from "../../images/progress.svg"
import CommentRow from "./CommentRow"

export default function SearchCommentsList(props: {keyword: string, className?: string}) {
    
    const [comments, setComments] = useState<Comment[] | null>(null)
    const [isLoaded, setIsLoaded] = useState(false)

    async function readComments() {
        
        setIsLoaded(false)
        const comments = await FireComments.readCommentsByKeyword(props.keyword)
        setComments(comments)
        setIsLoaded(true)
    }

    useEffect(() => {

        readComments()
        // eslint-disable-next-line
    }, [props.keyword])

    return (
        <div className={props.className}>

            {!isLoaded &&
                <div className='flex justify-center p-3'>
                    <img src={progress} alt='loading' />
                </div>
            }

            {isLoaded && comments === null &&
                <div className="p-3">
                    <p className="text-gray-500 text-center">読み取りに失敗しました。</p>
                </div>
            }

            {isLoaded && comments !== null && comments.length === 0 &&
                <div className="p-3">
                    <p className="text-gray-500 text-center">結果なし</p>
                </div>
            }

            {isLoaded && comments !== null &&
                <div>
                    {comments.map((comment) => (
                        <CommentRow key={comment.id} comment={comment}/>
                    ))}
                </div>
            }
        </div>
    )
}