import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { Bell, LogOut, Settings, User } from "lucide-react";
import { useState } from "react";

// Admin user details
const adminUser = {
    name: 'Javed Akhtar',
    email: 'javedakhtar@gmail.com',
    role: 'Super Admin',
    avatar: '/path/to/avatar.jpg'
};

export default function Header() {
    const [newRequests, setNewRequests] = useState(5);

    // Logout handler
    const handleLogout = () => {
        console.log('Logging out');
    };

    return (
        <div className="bg-white shadow-sm p-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
            <div className="flex items-center space-x-4">
                <div className="relative">
                    <Bell
                        className={`h-6 w-6 ${newRequests > 0 ? 'text-orange-400 animate-bounce' : 'text-gray-500'}`}
                    />
                    {newRequests > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full px-2 py-1 text-xs">
                            {newRequests}
                        </span>
                    )}
                </div>

                {/* Admin Profile Dropdown */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Avatar className="cursor-pointer">
                            <AvatarImage src={adminUser.avatar} alt={adminUser.name} />
                            <AvatarFallback className="bg-orange-400 text-white">
                                {adminUser.name.split(' ').map(name => name[0]).join('')}
                            </AvatarFallback>
                        </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                        <DropdownMenuLabel>
                            <div className="flex flex-col">
                                <span className="font-medium">{adminUser.name}</span>
                                <span className="text-xs text-gray-500">{adminUser.email}</span>
                                <span className="text-xs text-orange-600">{adminUser.role}</span>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                            <User className="mr-2 h-4 w-4" />
                            <span>Profile</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Settings className="mr-2 h-4 w-4" />
                            <span>Settings</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            className="text-red-600 focus:text-red-600"
                            onSelect={handleLogout}
                        >
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>Logout</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    )
}