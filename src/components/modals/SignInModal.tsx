import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { MdOutlineClose } from "react-icons/md"
import FireAuth from "../../utilities/FireAuth"


export default function SignInModal() {

    const navigate = useNavigate()
    const body = document.body
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    useEffect(() => {

        document.title = "サインイン - Meetings"
        body.style.overflowY = "hidden"
    })

    function closeModal() {

        body.style.overflowY = ""
        navigate(-1)
    }

    async function signIn() {

        const result = await FireAuth.signIn(email, password)

        // 成功
        if (result !== null) {
            closeModal()
            return
        }

        // 失敗
        setEmail("")
        setPassword("")
    }

    return (
        <div className="z-30 fixed top-0 left-0 w-full h-full flex justify-center items-center">

            <div onClick={closeModal} className="w-full h-full bg-black/20 dark:bg-white/20"></div>

            <div className="absolute bg-white dark:bg-black p-6 rounded-xl md:width-600 w-11/12">

                <button onClick={closeModal} className="p-3 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-full">
                    <MdOutlineClose className="text-2xl text-gray-500" />
                </button>

                <div className="px-3">

                    <h2 className="text-2xl font-bold">サインイン</h2>

                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="メールアドレス" className="mt-5 p-2 w-full rounded-md border border-gray-500 bg-transparent placeholder:text-gray-500"/>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="パスワード" className="mt-5 p-2 w-full rounded-md border border-gray-500 bg-transparent placeholder:text-gray-500"/>
                </div>

                <div className="mt-3 flex justify-end">
                    <button onClick={signIn} disabled={email === "" || password === ""} className={`font-bold p-3 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-900 ${email === "" || password === "" ? "text-gray-400 dark:text-gray-600 hover:bg-transparent dark:hover:bg-transparent" : ""}`}>サインイン</button>
                </div>
            </div>
        </div>
    )
}