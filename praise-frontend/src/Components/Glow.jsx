const Glow = () => (
  <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center">
    <div
      className="rounded-full"
      style={{
        width: "2000px", // Increased width
        height: "700px", // Height remains the same
        background: "radial-gradient(circle, #00ffe7 0%, #000 70%)",
        filter: "blur(120px)",
        opacity: 0.5,
      }}
    />
  </div>
);

export default Glow;
