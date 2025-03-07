import * as React from "react"
import { cn } from "@/lib/utils"
import { Eye } from "lucide-react"
import { EyeOff } from "lucide-react"
import { useState } from "react"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {

    const [showPassword, setShowPassword] = useState(false)
    return (
      <div className="relative">
        <input
          type={showPassword ? "text" : type}
          className={cn(
            "flex h-10 w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-base ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-neutral-950 placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:border-neutral-800 dark:bg-neutral-950 dark:ring-offset-neutral-950 dark:file:text-neutral-50 dark:placeholder:text-neutral-400 dark:focus-visible:ring-neutral-300",
            className
          )}
          ref={ref}
          {...props}
        />
        {
          type === "password" ? showPassword ? <Eye className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer" size={20} onClick={() => setShowPassword(false)}></Eye> :
            <EyeOff className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer" size={20} onClick={
              () => setShowPassword(true)
            }></EyeOff>
            : null
        }
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
