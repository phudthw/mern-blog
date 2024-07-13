import { Sidebar } from "flowbite-react";
import { useEffect, useState } from "react";
import { HiUser, HiArrowSmRight, HiDocumentText } from 'react-icons/hi'
import { Link, useLocation } from "react-router-dom";
import { signoutSuccess } from "../redux/user/userSlice";
import { useDispatch, useSelector } from "react-redux"


export default function DashSidebar() {
    const location = useLocation()
    const dispatch = useDispatch()
    const {currentUser} = useSelector(state => state.user)
    const [tab, setTab] = useState('')
    useEffect(() => {
        const urlParams = new URLSearchParams(location.search)
        const tabFromUrl = urlParams.get('tab')
        if(tabFromUrl) {
        setTab(tabFromUrl)
        }
    }, [location.search])

    const handleSignout = async () => {
        try {
            const res = await fetch('/api/user/signout', {
                method: 'POST'
            })
            const data = await res.json()
            if(!res.ok) {
                console.log(data.message)
            } else {
                dispatch(signoutSuccess())
            }
        } catch (error) {
            console.log(error.message)
        }
    }
    
  return (
    <Sidebar className="w-full md:w-72">
        <Sidebar.Items>
            <Sidebar.ItemGroup className="flex flex-col gap-1">
                <Link to='/dashboard?tab=profile'>
                    <Sidebar.Item active={tab === 'profile'} icon={HiUser} label={currentUser.isAdmin ? 'Admin' : 'User'} labelColor='dark' className="mb-2" as='div'>
                        Profile
                    </Sidebar.Item>
                </Link>
                <Link to='/dashboard?tab=posts'>
                    <Sidebar.Item active={ tab=== 'posts' } icon={HiDocumentText} as='div'>Posts</Sidebar.Item>
                </Link>
                <Sidebar.Item onClick={handleSignout} icon={HiArrowSmRight} className="cursor-pointer" as='div'>
                    Sign Out
                </Sidebar.Item>
            </Sidebar.ItemGroup>
        </Sidebar.Items>
    </Sidebar>
  )
}
    