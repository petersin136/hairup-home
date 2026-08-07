import type { MouseEvent } from "react";

/** 같은 페이지 해시 링크로 해당 섹션까지 부드럽게 스크롤합니다. */
export function scrollToHash(href: string) {
  if (!href.startsWith("#") || href.length < 2) return false;
  const el = document.getElementById(href.slice(1));
  if (!el) return false;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
  window.history.pushState(null, "", href);
  return true;
}

export function onHashClick(
  event: MouseEvent<HTMLAnchorElement>,
  href: string,
) {
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  if (scrollToHash(href)) event.preventDefault();
}
