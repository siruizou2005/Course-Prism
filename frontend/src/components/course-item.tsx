import { List, Tag, Grid } from "antd";
import Link from "next/link";
import { useRouter } from "next/router";
import { ReactNode } from "react";

const { useBreakpoint } = Grid;

import Config from "@/config/config";
import { CourseListItem } from "@/lib/models";
import { CommonInfoContext } from "@/lib/context";

const ratingColor = (avg: number) => {
  if (avg >= 4.5) return "#059669";
  if (avg >= 4.0) return "#d97706";
  if (avg >= 3.5) return "#0f172a";
  return "#dc2626";
};

const highlight = (text: string, kw: string | undefined): ReactNode => {
  if (!kw || !text) return text;
  const idx = text.indexOf(kw);
  if (idx < 0) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark style={{ background: "rgba(245,179,1,0.25)", color: "inherit", padding: "0 2px", borderRadius: 3 }}>
        {kw}
      </mark>
      {text.slice(idx + kw.length)}
    </>
  );
};

const CourseItem = ({
  course,
  showEnroll,
}: {
  course: CourseListItem;
  showEnroll?: boolean;
}) => {
  const screens = useBreakpoint();
  const isMobile = !screens.md;
  const router = useRouter();
  const keyword = router.query.q as string | undefined;

  return (
    <CommonInfoContext.Consumer>
      {(commonInfo) => {
        const hasRating = course.rating.count > 0;
        const ratingBlock = hasRating ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 2, minWidth: 72 }}>
            <span style={{ fontSize: 26, fontWeight: 700, lineHeight: 1, color: ratingColor(course.rating.avg) }}>
              {course.rating.avg.toFixed(1)}
            </span>
            <span style={{ fontSize: 11, color: "#94a3b8" }}>{course.rating.count}人评价</span>
          </div>
        ) : (
          <span style={{ fontSize: 13, color: "#94a3b8", minWidth: 72, textAlign: "right" }}>暂无点评</span>
        );

        return (
          <List.Item key={course.id} extra={ratingBlock}>
            <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 6 }}>
              {/* Title row */}
              <div style={{ display: "flex", alignItems: "baseline", gap: 8, flexWrap: "wrap" }}>
                <span style={{
                  fontSize: 11, fontWeight: 700, color: "#2563eb",
                  background: "#eff6ff", padding: "2px 7px", borderRadius: 4,
                  letterSpacing: 0.3,
                }}>
                  {course.code}
                </span>
                <Link href={"/course/" + course.id} style={{ fontSize: 15, fontWeight: 600, color: "#0f172a" }}>
                  {highlight(course.name, keyword)}
                </Link>
                <span style={{ fontSize: 13, color: "#64748b" }}>· {course.teacher}</span>
              </div>

              {/* Meta row */}
              <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", fontSize: 12.5, color: "#64748b" }}>
                {showEnroll && commonInfo?.enrolled_courses.has(course.id) && (
                  <Tag color={Config.TAG_COLOR_ENROLL} style={{ margin: 0 }}>学过</Tag>
                )}
                {commonInfo?.reviewed_courses.has(course.id) && (
                  <Tag color={Config.TAG_COLOR_REVIEW} style={{ margin: 0 }}>已点评</Tag>
                )}
                {course.categories && course.categories.map((cat) => (
                  <span key={cat} style={{
                    fontSize: 11.5, padding: "2px 7px", borderRadius: 4,
                    background: "#ecfdf5", color: "#047857", fontWeight: 500,
                  }}>
                    {cat}
                  </span>
                ))}
                <span>{course.credit} 学分</span>
                <span style={{ width: 3, height: 3, borderRadius: 999, background: "#cbd5e1", display: "inline-block" }} />
                <span>{course.department}</span>
                {(course.features ?? []).map((f) => (
                  <span key={f} style={{ display: "inline-flex", alignItems: "center", gap: 3, color: "#059669" }}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                    {f}
                  </span>
                ))}
              </div>
            </div>
          </List.Item>
        );
      }}
    </CommonInfoContext.Consumer>
  );
};

export default CourseItem;
