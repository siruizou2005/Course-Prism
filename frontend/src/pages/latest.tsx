import { SearchOutlined } from "@ant-design/icons";
import { Skeleton, Grid } from "antd";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

import AuthGuardLink from "@/components/auth-guard-link";
import { CourseInReview, Pagination, Review, Semester } from "@/lib/models";
import { useReviews } from "@/services/review";

const { useBreakpoint } = Grid;

/* ── helpers ── */

const stripMarkdown = (src: string) =>
  src.replace(/[#*`_~\[\]()>!]/g, "").replace(/\n+/g, " ").trim();

const semesterName = (s: string | Semester) =>
  typeof s === "string" ? s : s?.name ?? "";

const HOT_TAGS = ["高数", "英语", "马原", "统计学", "金融学", "微积分", "概率论", "心理学"];

/* ── sub-components ── */

const Stars = ({ value }: { value: number }) => {
  const full = Math.floor(value);
  const half = value - full >= 0.5;
  return (
    <span style={{ display: "inline-flex", gap: 1, fontSize: 13, lineHeight: 1 }}>
      {[0,1,2,3,4].map(i => (
        <span key={i} style={{ color: i < full ? "#f5b301" : (i === full && half ? "#f5b301" : "#e2e6ee") }}>★</span>
      ))}
    </span>
  );
};

const ReviewRow = ({ review }: { review: Review }) => {
  const course = review.course as CourseInReview | undefined;
  const excerpt = stripMarkdown(review.comment).slice(0, 200);
  const semester = semesterName(review.semester);
  const dateStr = (review.modified_at || review.created_at || "").slice(0, 16).replace("T", " ");
  const href = course ? `/course/${course.id}` : "#";

  return (
    <Link href={href} style={{ textDecoration: "none" }}>
      <div
        style={{ display: "block", padding: "16px 22px", borderBottom: "1px solid #eef0f4", transition: "background .15s", cursor: "pointer" }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "#fafbfd")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
      >
        {/* course + teacher */}
        <div style={{ display: "flex", alignItems: "baseline", gap: 8, flexWrap: "wrap", marginBottom: 8 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: "#2563eb", background: "#eff6ff", padding: "2px 8px", borderRadius: 4, letterSpacing: "0.4px" }}>
            {course?.code ?? "—"}
          </span>
          <span style={{ fontSize: 16, fontWeight: 600, color: "#0f172a" }}>{course?.name ?? "未知课程"}</span>
          <span style={{ fontSize: 13, color: "#64748b" }}>· {course?.teacher}</span>
        </div>
        {/* excerpt */}
        <p style={{ margin: "0 0 10px", fontSize: 14, color: "#334155", lineHeight: 1.65, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          {excerpt}
        </p>
        {/* meta */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap", fontSize: 12.5, color: "#94a3b8" }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
            <Stars value={review.rating} />
            <em style={{ fontStyle: "normal", fontWeight: 600, color: "#475569", fontSize: 13 }}>{review.rating}.0</em>
          </span>
          <span>学期 {semester}</span>
          <span>{dateStr}</span>
          <span style={{ flex: 1 }} />
          <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z"/><path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/></svg>
            {review.reactions?.approves ?? 0}
          </span>
          <span style={{ color: "#94a3b8", fontSize: 12 }}>#{review.id}</span>
        </div>
      </div>
    </Link>
  );
};

/* ── page ── */

const DiscoverPage = () => {
  const router = useRouter();
  const screens = useBreakpoint();
  const isMobile = !screens.md;
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<"latest" | "hot" | "high">("latest");

  const pagination: Pagination = { page: 1, pageSize: 9 };
  const { reviews, loading } = useReviews(pagination, tab);

  const handleSearch = () => {
    const q = query.trim();
    if (q) router.push({ pathname: "/courses", query: { q } });
  };

  return (
    <>
      <Head>
        <title>发现 - SWUFE选课社区</title>
        <meta name="description" content="搜索西南财大课程，查看真实学生点评" />
      </Head>

      {/* ── Hero ── */}
      <div
        className="hero-breakout"
        style={{
          position: "relative",
          overflow: "hidden",
          borderBottom: "1px solid #e6e8ee",
          background: "linear-gradient(180deg, #fafbff 0%, #ffffff 100%)",
        }}
      >
        {/* geometric decoration */}
        <svg
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
          width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 1440 520" aria-hidden="true"
        >
          <defs>
            <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
              <path d="M48 0H0V48" fill="none" stroke="rgba(37,99,235,0.06)" strokeWidth="1"/>
            </pattern>
            <linearGradient id="fade" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="white" stopOpacity="0"/>
              <stop offset="100%" stopColor="white" stopOpacity="1"/>
            </linearGradient>
            <linearGradient id="line-grad" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0%" stopColor="rgba(37,99,235,0)"/>
              <stop offset="50%" stopColor="rgba(37,99,235,0.35)"/>
              <stop offset="100%" stopColor="rgba(37,99,235,0)"/>
            </linearGradient>
          </defs>
          <rect width="1440" height="520" fill="url(#grid)"/>
          <circle cx="1220" cy="120" r="180" fill="none" stroke="rgba(37,99,235,0.10)" strokeWidth="1.2"/>
          <circle cx="1220" cy="120" r="120" fill="none" stroke="rgba(37,99,235,0.14)" strokeWidth="1.2"/>
          <circle cx="1220" cy="120" r="60"  fill="none" stroke="rgba(37,99,235,0.18)" strokeWidth="1.2"/>
          <path d="M-20 380 L260 180 L260 380 Z" fill="rgba(37,99,235,0.04)"/>
          <path d="M-20 380 L260 180" stroke="rgba(37,99,235,0.18)" strokeWidth="1"/>
          <line x1="0" y1="430" x2="1440" y2="430" stroke="url(#line-grad)" strokeWidth="1"/>
          <circle cx="180" cy="120" r="3" fill="rgba(37,99,235,0.45)"/>
          <circle cx="320" cy="60" r="2" fill="rgba(37,99,235,0.35)"/>
          <circle cx="1080" cy="380" r="2.5" fill="rgba(37,99,235,0.4)"/>
          <circle cx="980" cy="80" r="2" fill="rgba(37,99,235,0.3)"/>
          <rect width="1440" height="520" fill="url(#fade)"/>
        </svg>

        {/* content */}
        <div
          style={{
            position: "relative",
            zIndex: 2,
            maxWidth: 1200,
            margin: "0 auto",
            padding: isMobile ? "40px 16px 36px" : "88px 32px 72px",
            textAlign: "center",
          }}
        >
          {/* eyebrow badge */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 14px",
              borderRadius: 999,
              background: "#eff6ff",
              color: "#1d4ed8",
              fontSize: 13,
              fontWeight: 500,
              marginBottom: 24,
            }}
          >
            <span style={{
              width: 6, height: 6, borderRadius: 999,
              background: "#2563eb",
              boxShadow: "0 0 0 4px rgba(37,99,235,0.15)",
              display: "inline-block",
              flexShrink: 0,
            }}/>
            西南财经大学 · 选课社区
          </div>

          <h1
            style={{
              fontSize: "clamp(36px, 5vw, 56px)",
              lineHeight: 1.15,
              fontWeight: 800,
              letterSpacing: "-1px",
              color: "#0f172a",
              margin: "0 0 18px",
            }}
          >
            找到
            <span style={{ color: "#2563eb", position: "relative" }}>
              最适合你
              <span style={{
                content: '""',
                position: "absolute",
                left: "4%", right: "4%", bottom: 4,
                height: 10,
                background: "rgba(37,99,235,0.14)",
                borderRadius: 4,
                zIndex: -1,
                display: "block",
              }}/>
            </span>
            的课
          </h1>
          <p
            style={{
              fontSize: isMobile ? 15 : 17,
              color: "#64748b",
              margin: "0 auto 36px",
              maxWidth: 640,
            }}
          >
            来自 1,000+ 名同学的真实点评，覆盖 SWUFE 全校全部课程
          </p>

          {/* search bar */}
          <div style={{ maxWidth: 720, margin: "0 auto" }}>
            <div
              id="search-box"
              style={{
                display: "grid",
                gridTemplateColumns: "auto 1fr auto auto",
                alignItems: "center",
                height: isMobile ? 48 : 60,
                padding: isMobile ? "0 6px 0 14px" : "0 8px 0 22px",
                background: "white",
                border: "1px solid #e6e8ee",
                borderRadius: 999,
                boxShadow: "0 8px 28px rgba(15,23,42,0.08), 0 1px 2px rgba(15,23,42,0.04)",
                transition: "box-shadow 0.2s, border-color 0.2s",
              }}
              onFocusCapture={(e) => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.borderColor = "#2563eb";
                el.style.boxShadow = "0 0 0 4px rgba(37,99,235,0.12), 0 8px 28px rgba(15,23,42,0.08)";
              }}
              onBlurCapture={(e) => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.borderColor = "#e6e8ee";
                el.style.boxShadow = "0 8px 28px rgba(15,23,42,0.08), 0 1px 2px rgba(15,23,42,0.04)";
              }}
            >
              <SearchOutlined style={{ fontSize: 18, color: "#64748b" }} />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="搜索课程、教师、课程代码…"
                style={{
                  border: 0, outline: 0, background: "transparent",
                  height: "100%", padding: "0 14px",
                  fontSize: 16, color: "#0f172a",
                  fontFamily: "inherit",
                  width: "100%",
                }}
              />
              <div style={{ width: 1, height: 22, background: "#e6e8ee", marginRight: 8 }}/>
              <button
                onClick={handleSearch}
                style={{
                  height: isMobile ? 36 : 44, padding: isMobile ? "0 16px" : "0 24px",
                  background: "#2563eb", color: "white",
                  border: 0, borderRadius: 999,
                  fontSize: 15, fontWeight: 600,
                  cursor: "pointer",
                  transition: "background 0.15s",
                  fontFamily: "inherit",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#1d4ed8")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "#2563eb")}
              >
                搜索
              </button>
            </div>

            {/* hot tags */}
            <div style={{ marginTop: 18, display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", alignItems: "center" }}>
              <span style={{ fontSize: 13, color: "#94a3b8", marginRight: 4 }}>热门</span>
              {HOT_TAGS.map((tag) => (
                <button
                  key={tag}
                  onClick={() => router.push({ pathname: "/courses", query: { q: tag } })}
                  style={{
                    display: "inline-block",
                    padding: "4px 12px",
                    fontSize: 13, color: "#334155",
                    background: "white",
                    border: "1px solid #e6e8ee",
                    borderRadius: 999,
                    cursor: "pointer",
                    transition: "all 0.15s",
                    fontFamily: "inherit",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "#2563eb";
                    e.currentTarget.style.borderColor = "#dbeafe";
                    e.currentTarget.style.background = "#eff6ff";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "#334155";
                    e.currentTarget.style.borderColor = "#e6e8ee";
                    e.currentTarget.style.background = "white";
                  }}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* stats */}
          <dl
            style={{
              margin: isMobile ? "36px auto 0" : "56px auto 0",
              padding: 0,
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              maxWidth: 720,
              borderTop: "1px solid #e6e8ee",
              paddingTop: 28,
            }}
          >
            {[
              { value: "1,200+", label: "真实点评" },
              { value: "3,300+", label: "覆盖课程" },
              { value: "1,900+", label: "授课教师" },
            ].map(({ value, label }) => (
              <div key={label} style={{ textAlign: "center" }}>
                <dt style={{
                  fontSize: 28, fontWeight: 700, color: "#0f172a",
                  fontVariantNumeric: "tabular-nums",
                  letterSpacing: "-0.5px",
                  margin: 0,
                }}>
                  {value}
                </dt>
                <dd style={{ margin: "4px 0 0", fontSize: 13, color: "#64748b" }}>
                  {label}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* ── Reviews ── */}
      <div
        className="hero-breakout"
        style={{
          position: "relative",
          overflow: "hidden",
          borderTop: "1px solid #e6e8ee",
          borderBottom: "1px solid #e6e8ee",
          background: "linear-gradient(180deg, #fafbff 0%, #ffffff 100%)",
        }}
      >
        {/* same geometric decoration as hero */}
        <svg
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
          width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 1440 600" aria-hidden="true"
        >
          <defs>
            <pattern id="grid2" width="48" height="48" patternUnits="userSpaceOnUse">
              <path d="M48 0H0V48" fill="none" stroke="rgba(37,99,235,0.03)" strokeWidth="1"/>
            </pattern>
            <linearGradient id="fade2" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="white" stopOpacity="0"/>
              <stop offset="100%" stopColor="white" stopOpacity="0.85"/>
            </linearGradient>
          </defs>
          <rect width="1440" height="600" fill="url(#grid2)"/>
          <circle cx="220" cy="80" r="160" fill="none" stroke="rgba(37,99,235,0.04)" strokeWidth="1"/>
          <circle cx="220" cy="80" r="100" fill="none" stroke="rgba(37,99,235,0.06)" strokeWidth="1"/>
          <circle cx="220" cy="80" r="50"  fill="none" stroke="rgba(37,99,235,0.08)" strokeWidth="1"/>
          <path d="M1460 420 L1180 200 L1180 420 Z" fill="rgba(37,99,235,0.02)"/>
          <path d="M1460 420 L1180 200" stroke="rgba(37,99,235,0.07)" strokeWidth="1"/>
          <circle cx="1260" cy="140" r="3" fill="rgba(37,99,235,0.18)"/>
          <circle cx="400" cy="40"  r="2" fill="rgba(37,99,235,0.14)"/>
          <circle cx="960"  cy="500" r="2.5" fill="rgba(37,99,235,0.16)"/>
          <rect width="1440" height="600" fill="url(#fade2)"/>
        </svg>

        <div style={{ position: "relative", zIndex: 2, maxWidth: 1200, margin: "0 auto",           padding: isMobile ? "32px 16px 24px" : "64px 32px 40px" }}>
        {/* section header */}
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 28, gap: 24, flexWrap: "wrap" }}>
          <div>
            <h2 style={{ fontSize: 24, fontWeight: 700, margin: 0, color: "#0f172a", letterSpacing: "-0.3px" }}>最新点评</h2>
            <p style={{ margin: "6px 0 0", fontSize: 14, color: "#64748b" }}>
              共 {reviews?.count ?? "…"} 条 · 来自真实同学
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: isMobile ? 8 : 12, flexWrap: "wrap" }}>
            <div style={{ display: "inline-flex", padding: 3, background: "#f1f5f9", borderRadius: 10, border: "1px solid #e2e8f0" }}>
              {(["latest", "hot", "high"] as const).map((t, i) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  style={{
                    border: 0, background: tab === t ? "white" : "transparent",
                    padding: isMobile ? "6px 14px" : "7px 20px", fontSize: isMobile ? 13 : 14,
                    color: tab === t ? "#1e293b" : "#94a3b8",
                    fontWeight: tab === t ? 600 : 500, borderRadius: 8, cursor: "pointer",
                    transition: "all .2s ease",
                    boxShadow: tab === t ? "0 1px 3px rgba(15,23,42,0.1), 0 1px 2px rgba(15,23,42,0.06)" : "none",
                    fontFamily: "inherit",
                    letterSpacing: "0.3px",
                  }}
                >
                  {["最新", "最热", "高分"][i]}
                </button>
              ))}
            </div>
            <AuthGuardLink href="/write-review" loginMessage="请先登录后再写点评">
              <button style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                padding: "8px 16px", height: 36,
                background: "#2563eb", color: "white",
                border: 0, borderRadius: 999,
                fontSize: 13.5, fontWeight: 600, cursor: "pointer",
                fontFamily: "inherit",
              }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 4v16M4 12h16"/></svg>
                写点评
              </button>
            </AuthGuardLink>
          </div>
        </div>

        {/* review list */}
        <div style={{ border: "1px solid #e6e8ee", borderRadius: 12, background: "white", overflow: "hidden" }}>
          {loading
            ? Array.from({ length: 5 }).map((_, i) => (
                <div key={i} style={{ padding: "16px 22px", borderBottom: "1px solid #eef0f4" }}>
                  <Skeleton active paragraph={{ rows: 2 }} />
                </div>
              ))
            : reviews?.results.map((review: Review) => (
                <ReviewRow key={review.id} review={review} />
              ))}
        </div>

        {/* bottom button */}
        {!loading && reviews && (
          <div style={{ marginTop: 24, textAlign: "center" }}>
            <Link href="/latest?page=2" style={{ textDecoration: "none" }}>
              <button style={{
                display: "inline-block", padding: "10px 22px",
                border: "1px solid #e6e8ee", borderRadius: 999,
                fontSize: 14, color: "#334155", fontWeight: 500,
                background: "white", cursor: "pointer",
                transition: "all .15s", fontFamily: "inherit",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#2563eb"; e.currentTarget.style.color = "#2563eb"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#e6e8ee"; e.currentTarget.style.color = "#334155"; }}
              >
                浏览全部 {reviews.count} 条点评 →
              </button>
            </Link>
          </div>
        )}
        </div>{/* inner max-width container */}
      </div>{/* hero-breakout */}

      {/* ── CTA ── */}
      <div
        className="hero-breakout"
        style={{
          marginTop: 40,
          background: "linear-gradient(135deg, #2563eb 0%, #1e40af 100%)",
          color: "white",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ position: "absolute", top: -40, right: -40, width: 280, height: 280, pointerEvents: "none" }}>
          <svg viewBox="0 0 200 200" width="100%" height="100%">
            <circle cx="100" cy="100" r="80" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="1"/>
            <circle cx="100" cy="100" r="55" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1"/>
            <circle cx="100" cy="100" r="30" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="1"/>
          </svg>
        </div>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: isMobile ? "32px 16px" : "56px 32px", display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr auto", alignItems: "center", gap: isMobile ? 20 : 32, position: "relative" }}>
          <div>
            <h3 style={{ margin: "0 0 6px", fontSize: 26, fontWeight: 700, letterSpacing: "-0.3px" }}>选过的课，写下你的看法</h3>
            <p style={{ margin: 0, fontSize: 15, opacity: 0.85 }}>每一条真实的点评，都是给学弟学妹的礼物。</p>
          </div>
            <div style={{ display: "flex", gap: 10, flexShrink: 0, flexWrap: "wrap" }}>
            <AuthGuardLink href="/write-review" loginMessage="请先登录后再写点评">
              <button style={{ background: "white", color: "#2563eb", border: 0, borderRadius: 999, padding: "12px 24px", fontSize: 14.5, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                写一条点评
              </button>
            </AuthGuardLink>
            <Link href="/about" style={{ textDecoration: "none" }}>
              <button style={{ background: "transparent", color: "white", border: "1px solid rgba(255,255,255,0.4)", borderRadius: 999, padding: "12px 22px", fontSize: 14.5, fontWeight: 500, cursor: "pointer", fontFamily: "inherit" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.1)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                了解社区规则
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default DiscoverPage;
