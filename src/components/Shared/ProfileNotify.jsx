import { useUserContext } from '@/Context/AuthContext'
import React from 'react'
import { Link } from 'react-router-dom'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { IconInvoice, IconLogout, IconNotification, IconSettings } from '@tabler/icons-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useGetProduct, useLogout } from '@/lib/Query/queryMutation'
import Loader from '../ui/Loader'


const ProfileNotify = ({ className }) => {
    const { user } = useUserContext()
    const { mutateAsync, isPending } = useLogout()
    const { data } = useGetProduct(user.id)

    let lowStock = []
    data?.forEach((row) => {
        if (row.Stock <= 10) lowStock.push(row)
    })



    return (
        <div className='flex items-center gap-4'>
            <div>
                <DropdownMenu>
                    <DropdownMenuTrigger className=' rounded-full '>
                        <img src={user.imageUrl || 'public/assets/ProfilePlaceholder.svg'} className={`${className} rounded-full`} alt="file" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                            <Link to={'/billing'} className='flex items-center gap-1 w-full'><IconInvoice /> <p>Billing</p></Link>
                        </DropdownMenuItem>

                        <DropdownMenuItem>
                            <Link to={'/setting'} className='flex w-full items-center gap-1'><IconSettings /> <p>Setting</p></Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <IconLogout onClick={() => mutateAsync()} /> <p>{isPending ? (<Loader />) : "Logout"}</p>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <div>
                <Popover>
                    <PopoverTrigger className='flex justify-center items-center'>
                        <IconNotification />
                        <div className={`${lowStock.length == 0 && 'hidden'} relative right-3 bottom-[4px]`}>
                            <span className="flex size-3 items-center justify-center rounded-full bg-red-500 dark:bg-red-500" aria-label="notification">
                                <span className="size-3 animate-ping rounded-full bg-red-500 motion-reduce:animate-none dark:bg-red-500">
                                </span>
                            </span>
                        </div>
                    </PopoverTrigger>
                    <PopoverContent>
                        {lowStock.length > 0 ?
                            lowStock?.map((row) => (
                                <><div className='text-sm py-2 dark:text-zinc-300 text-neutral-800'>{row.productName} is running Out of Stock. Stock:{row.Stock}</div>
                                    <hr></hr>
                                </>
                            )) : (<p>Nothing To Show.</p>)}
                    </PopoverContent>
                </Popover>

            </div>
        </div>
    )
}

export default ProfileNotify