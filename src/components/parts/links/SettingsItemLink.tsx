import { MdArrowForwardIos } from "react-icons/md"
import { Link, useLocation } from "react-router-dom"

function SettingsItemLink(props: { title: string, subTitle?: string, to: string, isShowArrow?: boolean, children: JSX.Element }) {

    const location = useLocation()

    return (
        <Link to={props.to} state={{ previousPath: location.pathname }}>

            <div className="p-3 flex justify-between items-center hover:bg-gray-100 dark:hover:bg-gray-900">

                <div className="flex gap-3 items-center">
                    {props.children}

                    <div className="flex flex-col">
                        <span>{props.title}</span>
                        <span className="text-gray-500">{props.subTitle}</span>
                    </div>
                </div>

                {props.isShowArrow &&
                    <MdArrowForwardIos className="text-gray-500" />
                }
            </div>
        </Link>
    )
}

export default SettingsItemLink