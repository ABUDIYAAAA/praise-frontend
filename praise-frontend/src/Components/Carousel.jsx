import { useState, useEffect } from "react";

const AutoCarousel = () => {
  const items = [
    { id: 1, text: "Slide 1", color: "bg-red-400" },
    { id: 2, text: "Slide 2", color: "bg-green-400" },
    { id: 3, text: "Slide 3", color: "bg-blue-400" },
    { id: 4, text: "Slide 4", color: "bg-yellow-400" },
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
        {items.map((item) => (
          <div
            key={item.id}
            className={`h-64 flex items-center justify-center text-3xl font-bold text-white ${item.color}`}
            style={{ width: `${100 / items.length}%` }}
          >
            {item.text}
          </div>
        ))}
      </div>

      {/* Dots navigation */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
        {items.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full ${
              current === index ? "bg-black" : "bg-gray-400"
            }`}
            onClick={() => setCurrent(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default AutoCarousel;
