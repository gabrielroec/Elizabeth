/* eslint-disable react/prop-types */
import { motion } from "framer-motion";

function WelcomeBar({ text, backgroundColor }) {
  return (
    <div style={{ backgroundColor }}>
      <div className="overflow-hidden whitespace-nowrap container mx-auto py-4">
        <motion.p
          className="inline-block font-bold text-white"
          animate={{ x: ["100%", "-100%"] }}
          transition={{
            repeat: Infinity,
            duration: 10,
            ease: "linear",
          }}
        >
          {text}
        </motion.p>
      </div>
    </div>
  );
}

export default WelcomeBar;
