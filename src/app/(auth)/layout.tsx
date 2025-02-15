export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative min-h-screen">
      <div 
        className="absolute inset-0 bg-cover bg-center" 
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&w=2850&q=80)'
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background/80 to-background/95" />
      
      <div className="relative z-10 mx-auto flex min-h-screen max-w-screen-xl items-center justify-center px-4">
        {children}
      </div>
    </div>
  )
}