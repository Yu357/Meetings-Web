import { useEffect, useState } from "react"
import User from "../../types/User"
import FireUser from "../../utilities/FireUser"
import progress from "../../images/progress.svg"

export default function SearchUsersScreen(props: { keyword: string, className?: string }) {

    const [users, setUsers] = useState<User[] | null>(null)
    const [isLoaded, setIsLoaded] = useState(false)

    async function readUsers() {

        const users = await FireUser.readUsersByKeyword(props.keyword)
        setUsers(users)
        setIsLoaded(true)
    }

    useEffect(() => {

        readUsers()
        // eslint-disable-next-line
    }, [props.keyword])

    return (
        <div className={props.className}>

            {!isLoaded &&
                <div className='flex justify-center p-3'>
                    <img src={progress} alt='loading' />
                </div>
            }

            {isLoaded && users === null &&
                <div className="p-3">
                    <p className="text-gray-500 text-center">読み取りに失敗しました。</p>
                </div>
            }

            {isLoaded && users !== null && users.length === 0 &&
                <div className="p-3">
                    <p className="text-gray-500 text-center">結果なし</p>
                </div>
            }

            {isLoaded && users !== null &&
                <div>
                    {users.map((user) => (
                        <div>
                            <p>{user.displayName}</p>
                        </div>
                    ))}
                </div>
            }
        </div>
    )
}