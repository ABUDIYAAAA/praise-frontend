const FloatingBits = () => {
  const bits = Array.from({ length: 30 }).map((_, i) => ({
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    delay: `${Math.random() * 4}s`,
    bit: Math.random() > 0.5 ? "0" : "1",
    size: `${10 + Math.random() * 16}px`,
    opacity: 0.2 + Math.random() * 0.4,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none z-0">
      {bits.map((b, i) => (
        <span
          key={i}
          style={{
            position: "absolute",
            left: b.left,
            top: b.top,
            fontSize: b.size,
            opacity: b.opacity,
            color: "#fff",
            filter: "blur(0.5px)",
            animation: `floatBits 6s linear infinite`,
            animationDelay: b.delay,
            fontFamily: "monospace",
            userSelect: "none",
          }}
        >
          {b.bit}
        </span>
      ))}
      <style>{`
                @keyframes floatBits {
                    0% { transform: translateY(0); }
                    100% { transform: translateY(-40px); opacity: 0.1; }
                }
            `}</style>
    </div>
  );
};
export default FloatingBits;
