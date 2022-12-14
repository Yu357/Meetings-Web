import { FiArrowLeft } from "react-icons/fi"
import { useNavigate } from "react-router-dom"

function BackButton(props: {className?: string}) {

    const navigate = useNavigate()

    return (
        <button onClick={() => navigate(-1)} className={`z-10 p-2 hover:bg-gray-300/30 dark:hover:bg-gray-700/50 transition rounded-full ${props.className}`}>
            <FiArrowLeft className="text-2xl" />
        </button>
    )
}

export default BackButton