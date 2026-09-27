import { motion } from "framer-motion";

export const EASE_OUT = [0.22, 1, 0.36, 1];

function Reveal({ children, as = "div", delay = 0, y = 24, className = "", ...rest }) {
  const Component = motion[as] || motion.div;

  return (
    <Component
      className={className}
      initial={{ opacity: 0, y, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay, ease: EASE_OUT }}
      {...rest}
    >
      {children}
    </Component>
  );
}

export default Reveal;
