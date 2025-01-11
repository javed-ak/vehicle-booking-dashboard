import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUserData } from "@/context/userContext";
import { Bell } from "lucide-react";
import { useRequests } from "@/hooks";
// Admin user details
// const adminUser = {
//     name: 'Javed Akhtar',
//     email: 'javedakhtar@gmail.com',
//     role: 'Super Admin',
//     avatar: '/path/to/avatar.jpg'
// };

export default function Header() {
    const { requests } = useRequests();

    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.clear();
        navigate('/signin')

    };
    const name = localStorage.getItem('name') || "";
    const email = localStorage.getItem('email');
    return (
        <div className="bg-white shadow-sm p-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
            <div className="flex items-center space-x-4">
                <div className="relative">
                    <Bell
                        className={`h-8 w-8 ${requests > 0 ? 'text-orange-400 animate-bounce' : 'text-gray-500'}`}
                    />
                    {requests > 0 && (
                        <span className="absolute -top-2 -right-1 bg-red-500 text-white rounded-full px-1 text-[10px]">
                            {requests}
                        </span>
                    )}
                </div>

                {/* Admin Profile Dropdown */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Avatar className="cursor-pointer">
                            {/* <AvatarImage src={name} alt={name.name} /> */}
                            <AvatarFallback className="bg-orange-400 text-white">
                                {name.split(' ').map(name => name[0]).join('')}
                            </AvatarFallback>
                        </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56 mr-4">
                        <DropdownMenuLabel>
                            <div className="flex flex-col text-center">
                                <span className="font-medium">{name}</span>
                                <span className="text-xs text-gray-500">{email}</span>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            className="text-red-600 focus:text-red-600 flex justify-center"
                            onClick={handleLogout}
                        >
                            <LogOut className="mr-2 h-4 w-4" />
                            <span >Logout</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    )
}