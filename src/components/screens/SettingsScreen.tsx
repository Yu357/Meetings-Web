import { useEffect } from "react"
import { AiOutlineEyeInvisible } from "react-icons/ai"
import { BsPerson } from "react-icons/bs"
import { useNavigate } from "react-router-dom"
import FireAuth from "../../utilities/FireAuth"
import SignOutButton from "../parts/buttons/SignOutButton"
import SettingsItemLink from "../parts/links/SettingsItemLink"
import TitleBar from "../parts/sections/TitleBar"

function SettingsScreen() {

    const navigate = useNavigate()

    useEffect(() => {

        // 非ログイン状態でこの画面にアクセスされたら、トップ画面へリダイレクト
        const uid = FireAuth.uid()
        if (!uid) {
            navigate('/')
        }
        // eslint-disable-next-line
    }, [])

    return (
        <div>
            <TitleBar>
                <span className='font-bold text-lg ml-3'>設定</span>
            </TitleBar>

            <SettingsItemLink title="アカウント情報" to="/settings/account">
                <BsPerson className="text-gray-500 text-2xl" />
            </SettingsItemLink>

            <SettingsItemLink title="ミュートしているユーザー" to="/settings/muted">
                <AiOutlineEyeInvisible className="text-gray-500 text-2xl" />
            </SettingsItemLink>

            <SignOutButton />
        </div>
    )
}

export default SettingsScreen