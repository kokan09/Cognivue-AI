import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";

function Hero() {
  const container = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".hero-title", {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      });
    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={container}>
      <h1 className="hero-title">
        Learn What Matters Next.
      </h1>
    </section>
  );
}

export default Hero;