export const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 will-change-auto">
      {/* Grid overlay */}
      <div className="absolute inset-0 grid-overlay opacity-30" />
      
      {/* Floating orbs - using CSS animations for better performance */}
      <div 
        className="floating-orb floating-orb-purple w-[600px] h-[600px] -top-40 -left-40 animate-float-slow"
        style={{ animationDelay: '0s' }}
      />
      
      <div 
        className="floating-orb floating-orb-cyan w-[500px] h-[500px] top-1/3 -right-40 animate-float-medium"
        style={{ animationDelay: '1s' }}
      />
      
      <div 
        className="floating-orb floating-orb-purple w-[400px] h-[400px] bottom-20 left-1/4 animate-float-slow"
        style={{ animationDelay: '2s' }}
      />

      <div 
        className="floating-orb floating-orb-cyan w-[300px] h-[300px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse-scale"
      />

      {/* Radial gradient overlay */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-background opacity-80" />
    </div>
  );
};
