import { useEffect } from "react";

function SEO({ title, description }) {
  useEffect(() => {
    document.title = title;

    const descriptionTag = document.querySelector(
      'meta[name="description"]'
    );

    if (descriptionTag) {
      descriptionTag.setAttribute("content", description);
    }
  }, [title, description]);

  return null;
}

export default SEO;