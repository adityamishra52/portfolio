import { Link } from "react-router-dom";
import SEO from "../components/SEO";

function NotFound() {
  return (
    <>
      <SEO
        title="404 Not Found"
        path="/404"
        description="The requested page was not found on Aditaya Kumar Mishra's portfolio."
        robots="noindex, follow"
      />
      <section className="page-section grid min-h-[60vh] place-items-center text-center">
        <div className="glass-panel max-w-2xl p-8">
          <span className="eyebrow mx-auto">404</span>
          <h1 className="page-title">This page does not exist.</h1>
          <p className="mx-auto mt-5 max-w-xl leading-8 text-slate-600 dark:text-slate-300">
            The route may have moved. Head back to the portfolio and keep exploring the real projects, skills, and work.
          </p>
          <Link className="btn-primary mt-8" to="/">
            Back to Home
          </Link>
        </div>
      </section>
    </>
  );
}

export default NotFound;
