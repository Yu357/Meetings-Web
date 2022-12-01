import { Menu, MenuButton } from '@szhsin/react-menu'
import { VscEllipsis } from 'react-icons/vsc'
import '@szhsin/react-menu/dist/index.css'
import "@szhsin/react-menu/dist/theme-dark.css"
import { useState } from "react"

function PopupMenu(props: { children: JSX.Element}) {

    const [isDark, setIsDark] = useState(false)

    function checkTheme() {
        const isDark = matchMedia(
            '(prefers-color-scheme: dark)'
        ).matches;

        setIsDark(isDark)
    }

    const menuButton = (
        <MenuButton className="hover:bg-zinc-100 dark:hover:bg-zinc-900 transition rounded-full aspect-square flex items-center p-1" onClick={checkTheme}>
            <VscEllipsis className={`text-xl text-gray-500 pointer-events-auto`} />
        </MenuButton>
    )

    return (
        <div className="z-10">

            <Menu menuButton={menuButton} theming={isDark ? "dark" : undefined} className="pointer-events-auto">
                {props.children}
            </Menu>
        </div>
    )
}

export default PopupMenu