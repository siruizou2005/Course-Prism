/* SWUFE 选课社区 — 首页 */

const { useState } = React;

// ---------- 数据 ----------
const HOT_COURSES = [
  { code: "MAT302", name: "高等数学II", teacher: "李楠", rating: 4.6, reviews: 128, tag: "数理基础" },
  { code: "CST122", name: "人工智能与现代科技", teacher: "潘宁宁", rating: 4.4, reviews: 96, tag: "通识" },
  { code: "ECO201", name: "微观经济学", teacher: "张明哲", rating: 4.5, reviews: 214, tag: "经济学" },
  { code: "FIN305", name: "公司金融", teacher: "王雪", rating: 4.7, reviews: 187, tag: "金融学" },
  { code: "STA210", name: "概率论与数理统计", teacher: "陈思远", rating: 4.3, reviews: 156, tag: "统计学" },
  { code: "HUM104", name: "大学生心理健康与人生发展", teacher: "霍雄", rating: 4.2, reviews: 89, tag: "通识" },
];

const TOP_TEACHERS = [
  { name: "王雪", dept: "金融学院", rating: 4.8, courses: 3 },
  { name: "张明哲", dept: "经济学院", rating: 4.7, courses: 2 },
  { name: "李楠", dept: "数学学院", rating: 4.6, courses: 4 },
  { name: "陈思远", dept: "统计学院", rating: 4.5, courses: 2 },
];

const LATEST_REVIEWS = [
  {
    id: 2839,
    code: "HUM104", course: "大学生心理健康与人生发展", teacher: "霍雄",
    rating: 3, term: "2024-2",
    excerpt: "小心背刺你",
    time: "2025/09/07 21:03", likes: 12, comments: 3,
  },
  {
    id: 2835,
    code: "MAT302", course: "高等数学II", teacher: "李楠",
    rating: 3, term: "2024-2",
    excerpt: "上课不怎么管学生，偶尔点次名，每次课后布置的作业稍微有点多，上课会分享日常，不无聊，老师讲得还行，主要是在带着学生讲题练题。但是严格按照各板块标准来打平时分，几乎不捞人，小测考的一般的平时分也不会高。",
    time: "2025/09/05 15:44", likes: 28, comments: 6,
  },
  {
    id: 2838,
    code: "CST122", course: "人工智能与现代科技", teacher: "潘宁宁",
    rating: 4, term: "2024-2",
    excerpt: "一学期三次点名，两次平时作业，上课比较严肃，对于小组作业的要求比较高，但感觉老师并没有论坛里说的那么可怕，认真完成了任务和认真对待期末论文的话，分数还是挺高的。",
    time: "2025/09/05 15:40", likes: 45, comments: 12,
  },
  {
    id: 2837,
    code: "PED205", course: "乒乓球2", teacher: "黄潭名",
    rating: 4, term: "2024-2",
    excerpt: "老师人不错，期末会给很多次机会考试，平时分挺高，不怎么点名，但是对于考核要求比较严格，水平一般的很难拿高分。",
    time: "2025/09/05 15:38", likes: 19, comments: 4,
  },
  {
    id: 2836,
    code: "IPT107", course: "思想道德与法治", teacher: "黄佐毅",
    rating: 5, term: "2024-2",
    excerpt: "讲课很有自己的风格，会结合时事，不是照本宣科。期末开卷，给分友好，整体体验非常好。",
    time: "2025/09/05 15:25", likes: 62, comments: 15,
  },
];

const HOT_TAGS = ["高数", "英语", "马原", "统计学", "金融学", "微积分", "概率论", "心理学", "经济学", "思政"];

// ---------- 工具 ----------
const Stars = ({ value, size = 14 }) => {
  const full = Math.floor(value);
  const half = value - full >= 0.5;
  return (
    <span className="stars" style={{ fontSize: size }}>
      {[0,1,2,3,4].map(i => (
        <span key={i} className={i < full ? "s-full" : (i === full && half ? "s-half" : "s-empty")}>★</span>
      ))}
    </span>
  );
};

// ---------- 顶部导航 ----------
function NavBar() {
  return (
    <header className="nav">
      <div className="nav-inner">
        <a className="brand" href="#">
          <span className="brand-mark">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <rect x="2" y="2" width="24" height="24" rx="7" fill="var(--brand)"/>
              <path d="M8 14.5l4 4 8-9" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
          <span className="brand-text">SWUFE<span className="brand-text-light">选课社区</span></span>
        </a>
        <nav className="nav-links">
          <a className="active" href="#">发现</a>
          <a href="#">关注</a>
          <a href="#">课程</a>
          <a href="#">老师</a>
          <a href="#">关于</a>
        </nav>
        <div className="nav-actions">
          <button className="icon-btn" aria-label="搜索">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>
            </svg>
          </button>
          <button className="icon-btn" aria-label="账户">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8"/>
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}

// ---------- Hero ----------
function Hero() {
  return (
    <section className="hero">
      {/* 几何线条装饰 */}
      <svg className="hero-deco" width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 1440 520" aria-hidden="true">
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
        {/* 大圆环 */}
        <circle cx="1220" cy="120" r="180" fill="none" stroke="rgba(37,99,235,0.10)" strokeWidth="1.2"/>
        <circle cx="1220" cy="120" r="120" fill="none" stroke="rgba(37,99,235,0.14)" strokeWidth="1.2"/>
        <circle cx="1220" cy="120" r="60"  fill="none" stroke="rgba(37,99,235,0.18)" strokeWidth="1.2"/>
        {/* 左侧三角/线 */}
        <path d="M-20 380 L260 180 L260 380 Z" fill="rgba(37,99,235,0.04)"/>
        <path d="M-20 380 L260 180" stroke="rgba(37,99,235,0.18)" strokeWidth="1"/>
        {/* 横向引导线 */}
        <line x1="0" y1="430" x2="1440" y2="430" stroke="url(#line-grad)" strokeWidth="1"/>
        {/* 散点 */}
        <circle cx="180" cy="120" r="3" fill="rgba(37,99,235,0.45)"/>
        <circle cx="320" cy="60" r="2" fill="rgba(37,99,235,0.35)"/>
        <circle cx="1080" cy="380" r="2.5" fill="rgba(37,99,235,0.4)"/>
        <circle cx="980" cy="80" r="2" fill="rgba(37,99,235,0.3)"/>
        {/* 渐隐到底 */}
        <rect width="1440" height="520" fill="url(#fade)"/>
      </svg>

      <div className="hero-inner">
        <div className="hero-eyebrow">
          <span className="dot"></span>
          西南财经大学 · 学生自治选课社区
        </div>
        <h1 className="hero-title">
          找到<span className="hl">值得选</span>的课
        </h1>
        <p className="hero-sub">
          来自 12,000+ 名同学的真实点评，覆盖 SWUFE 全校 1,800+ 门课程
        </p>

        {/* 搜索 */}
        <div className="search">
          <div className="search-box">
            <svg className="search-icn" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>
            </svg>
            <input placeholder="搜索课程、教师、课程代码…" />
            <div className="search-sep" />
            <button className="search-btn">搜索</button>
          </div>
          <div className="hot-tags">
            <span className="hot-tags-label">热门</span>
            {HOT_TAGS.slice(0,8).map(t => <a key={t} className="tag" href="#">{t}</a>)}
          </div>
        </div>

        {/* 统计 */}
        <dl className="stats">
          <div><dt>1,216</dt><dd>真实点评</dd></div>
          <div><dt>1,800+</dt><dd>覆盖课程</dd></div>
          <div><dt>520+</dt><dd>授课教师</dd></div>
          <div><dt>12k</dt><dd>注册同学</dd></div>
        </dl>
      </div>
    </section>
  );
}

// ---------- 热门课程 ----------
function HotCourses() {
  return (
    <section className="block">
      <div className="block-head">
        <div>
          <h2 className="block-title">热门课程</h2>
          <p className="block-sub">本周点评最多的课程</p>
        </div>
        <a className="more" href="#">查看全部 <span aria-hidden>›</span></a>
      </div>
      <div className="course-grid">
        {HOT_COURSES.map((c, i) => (
          <a key={c.code} className="course-card" href="#">
            <div className="cc-top">
              <span className="cc-tag">{c.tag}</span>
              <span className="cc-rank">No.{String(i+1).padStart(2,"0")}</span>
            </div>
            <div className="cc-code">{c.code}</div>
            <div className="cc-name">{c.name}</div>
            <div className="cc-teacher">{c.teacher}</div>
            <div className="cc-foot">
              <div className="cc-rating">
                <Stars value={c.rating} />
                <span className="cc-num">{c.rating.toFixed(1)}</span>
              </div>
              <span className="cc-reviews">{c.reviews} 条点评</span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

// ---------- 高分老师 ----------
function TopTeachers() {
  return (
    <section className="block">
      <div className="block-head">
        <div>
          <h2 className="block-title">高分老师</h2>
          <p className="block-sub">本学期评分排名靠前</p>
        </div>
        <a className="more" href="#">查看全部 <span aria-hidden>›</span></a>
      </div>
      <div className="teacher-grid">
        {TOP_TEACHERS.map(t => (
          <a key={t.name} className="teacher-card" href="#">
            <div className="t-avatar">{t.name[0]}</div>
            <div className="t-meta">
              <div className="t-name">{t.name}</div>
              <div className="t-dept">{t.dept}</div>
            </div>
            <div className="t-rating">
              <span className="t-num">{t.rating.toFixed(1)}</span>
              <Stars value={t.rating} size={12}/>
              <span className="t-courses">{t.courses} 门课</span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

// ---------- 最新点评 ----------
function LatestReviews() {
  const [tab, setTab] = useState("latest");
  return (
    <section className="block">
      <div className="block-head">
        <div>
          <h2 className="block-title">最新点评</h2>
          <p className="block-sub">共 1,216 条 · 来自真实同学</p>
        </div>
        <div className="rv-actions">
          <div className="tabs">
            <button className={tab==="latest"?"on":""} onClick={()=>setTab("latest")}>最新</button>
            <button className={tab==="hot"?"on":""} onClick={()=>setTab("hot")}>最热</button>
            <button className={tab==="high"?"on":""} onClick={()=>setTab("high")}>高分</button>
          </div>
          <button className="primary-btn">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 4v16M4 12h16"/>
            </svg>
            写点评
          </button>
        </div>
      </div>

      <div className="reviews">
        {LATEST_REVIEWS.map(r => (
          <a key={r.id} className="review-row" href="#">
            <div className="rv-left">
              <span className="rv-code">{r.code}</span>
              <span className="rv-course">{r.course}</span>
              <span className="rv-teacher">· {r.teacher}</span>
            </div>
            <p className="rv-excerpt">{r.excerpt}</p>
            <div className="rv-meta">
              <span className="rv-rating">
                <Stars value={r.rating} size={13}/>
                <em>{r.rating.toFixed(1)}</em>
              </span>
              <span className="rv-term">学期 {r.term}</span>
              <span className="rv-time">{r.time}</span>
              <span className="rv-spacer"/>
              <span className="rv-stat">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M7 10v11h10V10M2 10h20l-2-6H4z"/>
                </svg>
                {r.likes}
              </span>
              <span className="rv-stat">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 11a8 8 0 0 1-12.5 6.6L3 19l1.4-5.5A8 8 0 1 1 21 11z"/>
                </svg>
                {r.comments}
              </span>
              <span className="rv-id">#{r.id}</span>
            </div>
          </a>
        ))}
      </div>

      <div className="block-foot">
        <a className="ghost-btn" href="#">浏览全部 1,216 条点评 →</a>
      </div>
    </section>
  );
}

// ---------- CTA ----------
function CTA() {
  return (
    <section className="cta">
      <div className="cta-inner">
        <div className="cta-deco">
          <svg viewBox="0 0 200 200" width="100%" height="100%">
            <circle cx="100" cy="100" r="80" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="1"/>
            <circle cx="100" cy="100" r="55" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1"/>
            <circle cx="100" cy="100" r="30" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="1"/>
          </svg>
        </div>
        <div className="cta-text">
          <h3>选过的课，写下你的看法</h3>
          <p>每一条真实的点评，都是给学弟学妹的礼物。</p>
        </div>
        <div className="cta-actions">
          <button className="white-btn">写一条点评</button>
          <button className="ghost-on-blue">了解社区规则</button>
        </div>
      </div>
    </section>
  );
}

// ---------- Footer ----------
function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="f-col">
          <div className="brand brand-foot">
            <span className="brand-mark">
              <svg width="22" height="22" viewBox="0 0 28 28" fill="none">
                <rect x="2" y="2" width="24" height="24" rx="7" fill="var(--brand)"/>
                <path d="M8 14.5l4 4 8-9" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
            <span className="brand-text">SWUFE<span className="brand-text-light">选课社区</span></span>
          </div>
          <p className="f-desc">由学生自治维护的西南财经大学选课点评社区。</p>
        </div>
        <div className="f-col">
          <div className="f-title">浏览</div>
          <a href="#">课程库</a><a href="#">教师库</a><a href="#">最新点评</a><a href="#">点评排行</a>
        </div>
        <div className="f-col">
          <div className="f-title">参与</div>
          <a href="#">写点评</a><a href="#">发起讨论</a><a href="#">加入运营</a><a href="#">反馈建议</a>
        </div>
        <div className="f-col">
          <div className="f-title">关于</div>
          <a href="#">社区规则</a><a href="#">隐私协议</a><a href="#">联系我们</a><a href="#">GitHub</a>
        </div>
      </div>
      <div className="footer-bot">
        <span>© 2026 SWUFE 选课社区 · 学生自治项目</span>
        <span>蜀ICP备 xxxxxx号</span>
      </div>
    </footer>
  );
}

// ---------- Tweaks ----------
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "brand": "#2563eb",
  "radius": 12,
  "density": 5
}/*EDITMODE-END*/;

function App() {
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);

  React.useEffect(() => {
    const r = document.documentElement.style;
    r.setProperty("--brand", tweaks.brand);
    r.setProperty("--radius", tweaks.radius + "px");
    r.setProperty("--radius-sm", Math.max(4, tweaks.radius - 4) + "px");
    r.setProperty("--radius-lg", (tweaks.radius + 6) + "px");
    const pad = 8 + tweaks.density * 1.6;
    r.setProperty("--row-pad", pad + "px");
  }, [tweaks]);

  return (
    <>
      <NavBar />
      <main>
        <Hero />
        <div className="container">
          <HotCourses />
          <TopTeachers />
          <LatestReviews />
        </div>
        <CTA />
      </main>
      <Footer />

      <TweaksPanel title="Tweaks">
        <TweakSection title="主题">
          <TweakColor label="主色" value={tweaks.brand} onChange={v=>setTweak("brand", v)} />
          <TweakSlider label="圆角" min={0} max={24} step={1} value={tweaks.radius} onChange={v=>setTweak("radius", v)} />
          <TweakSlider label="信息密度" min={0} max={10} step={1} value={tweaks.density} onChange={v=>setTweak("density", v)} />
        </TweakSection>
      </TweaksPanel>
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
