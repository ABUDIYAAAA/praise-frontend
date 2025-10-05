import { useState, useEffect } from "react";

const AutoCarousel = () => {
  const items = [
    { id: 1, text: "🏅 Earn badges that showcase your contributions" },
    { id: 2, text: "📊 Instantly view your live project statistics" },
    { id: 3, text: "🎨 Customise and style badges for your repositories" },
    { id: 4, text: "🤝 Connect seamlessly with Discord or Slack" },
  ];

  const [current, setCurrent] = useState(0);

  // Auto slide every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % items.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [items.length]);

  return (
    <div className="bg-gray-100 max-w-xl mx-auto overflow-hidden relative rounded-lg shadow-lg">
      {/* Slides */}
      <div
        className="flex transition-transform ease-in-out duration-700 py-8"
        style={{
          width: `${items.length * 100}%`,
          transform: `translateX(-${current * (100 / items.length)}%)`,
        }}
      >
        {items.map((item, index) => (
          <div
            key={item.id}
            className="h-64 flex flex-col items-center justify-center text-center text-2xl md:text-3xl font-semibold text-gray-800"
            style={{ width: `${100 / items.length}%` }}
          >
            <span className="text-blue-500 text-sm font-mono mb-2">
              {String(index + 1).padStart(2, "0")} /{" "}
              {String(items.length).padStart(2, "0")}
            </span>
            <span>{item.text}</span>
          </div>
        ))}
      </div>

      {/* Dots navigation */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
        {items.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-colors ${
              current === index ? "bg-blue-600" : "bg-gray-400"
            }`}
            onClick={() => setCurrent(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default AutoCarousel;