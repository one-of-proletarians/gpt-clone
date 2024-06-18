import Prism from "prismjs";
import { FC, useMemo } from "react";
import { CodeHeader } from "./code-header";

export const Code: FC<{ className: string; children: string }> = ({
  children = "",
  className = "",
}) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const language = useMemo(
    () => className?.replace("language-", ""),
    [className],
  );
  const grammar = Prism.languages[language];

  if (!language)
    return (
      <code className="whitespace-pre-wrap before:content-[''] after:content-['']">
        {children}
      </code>
    );

  return (
    <>
      {language && <CodeHeader language={language} copyText={children} />}

      <code className={className}>
        {grammar ? (
          <div
            className="p-4"
            dangerouslySetInnerHTML={{
              __html: Prism.highlight(children, grammar, language),
            }}
          />
        ) : (
          children
        )}
      </code>
    </>
  );
};
