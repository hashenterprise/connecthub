'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Home, 
  MessageSquare, 
  Video, 
  Map, 
  User, 
  Bot, 
  Settings,
  LogOut
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/hooks/use-auth'
import  Button  from '../ui/button'
import { ThemeToggle } from '@/components/theme/theme-toggle'
import { UserNav } from './user-nav'

const navigationItems = [
  {
    title: 'Home',
    href: '/',
    icon: Home
  },
  {
    title: 'Chat',
    href: '/chat',
    icon: MessageSquare
  },
  {
    title: 'Meet',
    href: '/meet',
    icon: Video
  },
  {
    title: 'Location',
    href: '/location',
    icon: Map
  },
  {
    title: 'Shorts',
    href: '/shorts',
    icon: Video
  },
  {
    title: 'Profile',
    href: '/profile',
    icon: User
  },
  {
    title: 'Xen AI',
    href: '/xen',
    icon: Bot
  },
   {
  title: 'settings',
  href: '/settings',
  icon: Settings
   }
]

export function MainNav() {
  const pathname = usePathname()
  const { user, signOut } = useAuth()

  return (
    <nav className="flex flex-col h-screen bg-background border-r">
      <div className="p-6">
        <Link href="/" className="flex items-center space-x-2">
          <img src="/logo.svg" alt="Logo" className="w-8 h-8" />
          <span className="font-bold text-xl">Your App</span>
        </Link>
      </div>

      <div className="flex-1 px-4 space-y-2">
        {navigationItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors",
                isActive 
                  ? "bg-primary text-primary-foreground" 
                  : "hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.title}</span>
            </Link>
          )
        })}
      </div>

      <div className="p-6 border-t space-y-4">
        <UserNav />
        <ThemeToggle />
        <Button 
          variant="ghost" 
          className="w-full justify-start" 
          onClick={() => signOut()}
        >
          <LogOut className="w-5 h-5 mr-3" />
          Sign out
        </Button>
      </div>
    </nav>
  )
}