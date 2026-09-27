import { Fragment } from "react";
import { motion } from "framer-motion";
import { EASE_OUT } from "./Reveal";

export const wordVariants = {
  hidden: { opacity: 0, y: "0.5em", filter: "blur(10px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.8, ease: EASE_OUT },
    // Drop the filter once settled so dozens of words don't keep a live filter.
    transitionEnd: { filter: "none" },
  },
};

// Hyphenated words are split into separate inline-blocks ("production-" +
// "style") because a single inline-block can't wrap at its hyphen.
const splitAtHyphens = (word) => word.split("-").map((part, index, parts) => (index < parts.length - 1 ? `${part}-` : part));

// Must render inside a motion parent that sets the "hidden"/"visible" variants
// (and staggerChildren); real spaces are kept between words so copy/paste and
// screen readers still get normal text.
function AnimatedWords({ text }) {
  const words = text.split(" ");

  return words.map((word, index) => (
    <Fragment key={`${word}-${index}`}>
      {splitAtHyphens(word).map((part, partIndex) => (
        <motion.span className="inline-block" variants={wordVariants} key={`${part}-${partIndex}`}>
          {part}
        </motion.span>
      ))}
      {index < words.length - 1 && " "}
    </Fragment>
  ));
}

export default AnimatedWords;
