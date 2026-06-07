type ClarityCommand = "set" | "identify" | "event" | "consent";
type ClarityFn = ((command: ClarityCommand, ...args: string[]) => void) & { q?: Array<unknown[]> };

type ClarityWindow = Window & {
  clarity?: ClarityFn;
};

const projectId: string = import.meta.env.VITE_CLARITY_PROJECT_ID?.trim() ?? "";
const isProduction: boolean = import.meta.env.PROD;

let clarityLoaded = false;

/**
 * Clarity starts here.
 * The script is injected once, only in production, and duplicate loads are blocked.
 */
export const initClarity = (): void => {
  if (!isProduction || clarityLoaded || !projectId || typeof window === "undefined") {
    return;
  }

  const clarityWindow = window as ClarityWindow;

  if (document.getElementById("ms-clarity-script")) {
    clarityLoaded = true;
    return;
  }

  ((w: ClarityWindow, d: Document, tagName: string, id: string) => {
    w.clarity =
      w.clarity ||
      function clarity(command: ClarityCommand, ...args: string[]) {
        if (!w.clarity) {
          return;
        }
        w.clarity.q = w.clarity.q || [];
        w.clarity.q.push([command, ...args]);
      };

    const script = d.createElement(tagName);
    script.id = "ms-clarity-script";
    script.async = true;
    script.src = `https://www.clarity.ms/tag/${id}`;
    const firstScript = d.getElementsByTagName(tagName)[0];
    firstScript?.parentNode?.insertBefore(script, firstScript);
  })(clarityWindow, document, "script", projectId);

  clarityLoaded = true;
};
