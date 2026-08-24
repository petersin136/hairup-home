import { Fragment } from "react";

/** 여러 줄을 한 박스에서 br 로 이어 trim 이 첫·끝 글리프에만 걸리게 합니다. */
export function GlyphLines({ lines }: { lines: readonly string[] }) {
  return lines.map((line, i) => (
    <Fragment key={`${i}-${line}`}>
      {i > 0 ? <br /> : null}
      {line}
    </Fragment>
  ));
}
