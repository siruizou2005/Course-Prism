import { CourseFilterItem, CourseFilters } from "@/lib/models";

const CREDIT_OPTIONS = [
  { label: "1分", value: "1" },
  { label: "2分", value: "2" },
  { label: "3分", value: "3" },
  { label: "4分", value: "4" },
  { label: "5分以上", value: "5plus" },
];

const RATING_OPTIONS = [
  { label: "4.5 分以上", value: "4.5" },
  { label: "4.0 分以上", value: "4.0" },
  { label: "3.5 分以上", value: "3.5" },
  { label: "3.0 分以上", value: "3.0" },
];

const FEATURE_OPTIONS = [
  "不点名", "给分友好", "作业少", "期末划重点",
  "讲课清晰", "考试简单", "开卷考试", "平时分高",
  "小组项目", "强烈推荐", "线上", "实践课",
];

const Stars = ({ value }: { value: number }) => {
  const full = Math.floor(value);
  const half = value - full >= 0.5;
  return (
    <span style={{ color: "#fbbf24", fontSize: 13, letterSpacing: 1 }}>
      {[0, 1, 2, 3, 4].map((i) => (
        <span key={i} style={{ opacity: i < full ? 1 : i === full && half ? 0.5 : 0.2 }}>
          ★
        </span>
      ))}
    </span>
  );
};

export type FilterSelected = {
  departments?: string;
  categories?: string;
  credit?: string;
  min_rating?: string;
  feature?: string;
};

const CourseFilterCard = ({
  filters,
  loading,
  selected,
  onChange,
}: {
  filters: CourseFilters | undefined;
  loading: boolean;
  selected: FilterSelected;
  onChange: (key: string, value: string | null) => void;
}) => {
  const toggle = (key: string, value: string) => {
    onChange(key, selected[key as keyof FilterSelected] === value ? null : value);
  };

  if (loading && !filters) {
    return <div className="filter-sidebar" style={{ minHeight: 200 }} />;
  }

  return (
    <div className="filter-sidebar">
      <div className="filter-group">
        <div className="filter-title">
          学院 <small>{filters?.departments.length ?? 0}</small>
        </div>
        <div style={{ maxHeight: 240, overflowY: "auto", paddingRight: 2 }}>
          {filters?.departments.map((dept: CourseFilterItem) => (
            <div
              key={dept.id}
              className={"filter-item" + (selected.departments === String(dept.id) ? " on" : "")}
              onClick={() => toggle("departments", String(dept.id))}
            >
              <span>{dept.name}</span>
              <span className="count">{dept.count}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="filter-group">
        <div className="filter-title">课程类别</div>
        <div className="filter-chips">
          {filters?.categories.map((cat: CourseFilterItem) => (
            <button
              key={cat.id}
              className={"filter-chip" + (selected.categories === String(cat.id) ? " on" : "")}
              onClick={() => toggle("categories", String(cat.id))}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      <div className="filter-group">
        <div className="filter-title">学分</div>
        <div className="filter-chips">
          {CREDIT_OPTIONS.map((c) => (
            <button
              key={c.value}
              className={"filter-chip" + (selected.credit === c.value ? " on" : "")}
              onClick={() => toggle("credit", c.value)}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <div className="filter-group">
        <div className="filter-title">评分</div>
        {RATING_OPTIONS.map((r) => (
          <div
            key={r.value}
            className={"filter-rating-item" + (selected.min_rating === r.value ? " on" : "")}
            onClick={() => toggle("min_rating", r.value)}
          >
            <Stars value={parseFloat(r.value)} />
            <span style={{ fontSize: 13, color: "#334155", marginLeft: 6 }}>{r.label}</span>
          </div>
        ))}
      </div>

      <div className="filter-group" style={{ borderBottom: 0 }}>
        <div className="filter-title">特征</div>
        <div className="filter-chips">
          {FEATURE_OPTIONS.map((f) => (
            <button
              key={f}
              className={"filter-chip" + (selected.feature === f ? " on" : "")}
              onClick={() => toggle("feature", f)}
            >
              {f}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CourseFilterCard;
