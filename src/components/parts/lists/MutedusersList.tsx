import { useEffect, useState } from "react"
import User from "../../../entities/User"
import FireUsers from "../../../utilities/FireUsers"
import ProgressImage from "../images/ProgressImage"
import UserRow from "../rows/UserRow"

function MutedUsersList() {

    const [users, setUsers] = useState<User[] | null>(null)
    const [isLoaded, setIsLoaded] = useState(false)

    async function readUsers() {

        setIsLoaded(false)

        const users = await FireUsers.readMutedUsers()
        setUsers(users)
        setIsLoaded(true)
    }

    useEffect(() => {
        readUsers()
        // eslint-disable-next-line
    }, [])

    return (
        <div>
            {!isLoaded &&
                <div className='flex justify-center p-3'>
                    <ProgressImage />
                </div>
            }

            {isLoaded && users === null &&
                <div className="p-3">
                    <p className="text-gray-500 text-center">読み取りに失敗しました</p>
                </div>
            }

            {isLoaded && users !== null && users.length === 0 &&
                <div className="p-3">
                    <p className="text-gray-500 text-center">ミュート中のユーザーはいません</p>
                </div>
            }

            {isLoaded && users !== null &&
                <div>
                    {users.map((user) => (
                        <UserRow key={user.id} user={user} />
                    ))}
                </div>
            }
        </div>
    )
}

export default MutedUsersList