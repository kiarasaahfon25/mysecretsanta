"use client";

import { useEffect, useRef } from "react";

type Snowflake = {
  x: number;
  y: number;
  radius: number;
  speedY: number;
  speedX: number;
};

export default function Snow() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const snowflakes = useRef<Snowflake[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;

    const setSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    setSize();
    window.addEventListener("resize", setSize);

    // create snowflakes
    snowflakes.current = Array.from({ length: 120 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 3 + 1,
      speedY: Math.random() * 1 + 0.5,
      speedX: Math.random() * 0.5 - 0.25, // slight drift
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "white";

      ctx.beginPath();
      for (let flake of snowflakes.current) {
        ctx.moveTo(flake.x, flake.y);
        ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
      }
      ctx.fill();

      update();
      requestAnimationFrame(draw);
    };

    const update = () => {
      for (let flake of snowflakes.current) {
        flake.y += flake.speedY;
        flake.x += flake.speedX;

        // reset when off screen
        if (flake.y > canvas.height) {
          flake.y = 0;
          flake.x = Math.random() * canvas.width;
        }

        // wrap horizontally
        if (flake.x > canvas.width) flake.x = 0;
        if (flake.x < 0) flake.x = canvas.width;
      }
    };

    draw();

    return () => {
      window.removeEventListener("resize", setSize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        pointerEvents: "none",
        zIndex: -1,
      }}
    />
  );
}