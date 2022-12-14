import { MenuItem } from '@szhsin/react-menu'
import { AiOutlineMeh } from 'react-icons/ai'
import PopupMenu from './PopupMenu'

function RecentTagMenu(props: { tag: string, removeTag: (tag: string) => void }) {

    return (
        <PopupMenu bg200>
            <MenuItem>

                <button onClick={() => props.removeTag(props.tag)} className="flex items-center gap-3 ">

                    <AiOutlineMeh className='text-gray-500 text-xl' />
                    <span>興味なし</span>
                </button>
            </MenuItem>
        </PopupMenu>
    )
}

export default RecentTagMenu