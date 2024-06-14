import { Sidebar } from "flowbite-react";
import { useEffect, useState } from "react";
import { HiUser, HiArrowSmRight } from 'react-icons/hi'
import { Link, useLocation } from "react-router-dom";
import { signoutSuccess } from "../redux/user/userSlice";
import { useDispatch } from "react-redux"



export default function DashSidebar() {
    const dispatch = useDispatch()
    const location = useLocation()
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
            <Sidebar.ItemGroup>
                <Link to='/dashboard?tab=profile'>
                    <Sidebar.Item active={tab === 'profile'} icon={HiUser} label={'User'} labelColor='dark' className="mb-2" as='div'>
                        Profile
                    </Sidebar.Item>
                    <Sidebar.Item onClick={handleSignout} icon={HiArrowSmRight} className="cursor-pointer" as='div'>
                        Sign Out
                    </Sidebar.Item>
                </Link>
            </Sidebar.ItemGroup>
        </Sidebar.Items>
    </Sidebar>
  )
}
