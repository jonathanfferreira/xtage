export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-background">
      {/* Glow Effects */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-secondary/20 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="relative z-10 w-full max-w-md p-8 glass-panel rounded-2xl shadow-2xl">
        {children}
      </div>
    </div>
  );
}
