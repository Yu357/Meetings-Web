import { Link, NavLink, useLocation } from 'react-router-dom'
import { AiOutlineHome, AiFillHome, AiOutlineLogin } from 'react-icons/ai'
import { HiSearch, HiOutlineSearch } from "react-icons/hi"
import { useEffect, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { BsPerson, BsPersonFill } from "react-icons/bs"
import FireAuth from '../../utilities/FireAuth'
import { auth } from '../../utilities/firebase'

export default function LeftColumn(props: { className?: string }) {

    const location = useLocation()
    const [uid, setUid] = useState<string | null>(FireAuth.uidFromLocalStorage())
    
    useEffect(() => {

        onAuthStateChanged(auth, (user) => {
            if (user) {

                const uid = user.uid

                setUid(uid)
                localStorage.setItem('uid', uid)

            } else {

                setUid(null)
                localStorage.removeItem('uid')
            }
        })
    }, [])

    return (
        <div className={props.className}>

            <div className='sticky top-0'>

                <div className='xl:block xl:px-4 flex justify-end px-2 pt-1'>

                    <NavLink to='/' className="text-inherit no-underline w-fit p-2 text-3xl font-sans xl:block hidden" onClick={() => window.scrollTo(0, 0)}>Meetings</NavLink>

                    <div>

                        <NavLink to='/' end className="block mt-2 rounded-full" onClick={() => window.scrollTo(0, 0)}>

                            {({ isActive }) => (

                                <div className='flex items-center hover:bg-zinc-100 dark:hover:bg-zinc-900 p-2 rounded-full'>

                                    <AiOutlineHome className={`text-3xl ${isActive ? "hidden" : "block"}`} />
                                    <AiFillHome className={`text-3xl ${isActive ? "block" : "hidden"}`} />

                                    <span className={`ml-5 text-xl xl:block hidden ${isActive ? "font-bold" : ""}`}>ホーム</span>
                                </div>
                            )}
                        </NavLink>

                        <NavLink to='/search' className="block mt-2 rounded-full" onClick={() => window.scrollTo(0, 0)}>

                            {({ isActive }) => (

                                <div className='flex items-center hover:bg-zinc-100 dark:hover:bg-zinc-900 p-2 rounded-full'>

                                    <HiOutlineSearch className={`text-3xl ${isActive ? "hidden" : "block"}`} />
                                    <HiSearch className={`text-3xl ${isActive ? "block" : "hidden"}`} />

                                    <span className={`ml-5 text-xl xl:block hidden ${isActive ? "font-bold" : ""}`}>検索</span>
                                </div>
                            )}
                        </NavLink>

                        {uid === null &&
                            <Link to='/sign-in' state={{ previousPath: location.pathname }} className="block mt-2 rounded-full">

                                <div className='flex items-center hover:bg-zinc-100 dark:hover:bg-zinc-900 p-2 rounded-full'>

                                    <AiOutlineLogin className={`text-3xl`} />
                                    <span className={`ml-5 text-xl xl:block hidden`}>サインイン</span>
                                </div>
                            </Link>
                        }

                        {uid !== null &&
                            <NavLink to={`/users/${uid}`} className="block mt-2 rounded-full" onClick={() => window.scrollTo(0, 0)}>

                                {({ isActive }) => (

                                    <div className='flex items-center hover:bg-zinc-100 dark:hover:bg-zinc-900 p-2 rounded-full'>

                                        <BsPerson className={`text-3xl ${isActive ? "hidden" : "block"}`} />
                                        <BsPersonFill className={`text-3xl ${isActive ? "block" : "hidden"}`} />

                                        <span className={`ml-5 text-xl xl:block hidden ${isActive ? "font-bold" : ""}`}>プロフィール</span>
                                    </div>
                                )}
                            </NavLink>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}