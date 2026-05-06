import { Card, Col, Input, Row } from "antd";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useRef } from "react";

import CourseFilterCard, { FilterSelected } from "@/components/course-filter-card";
import CourseList from "@/components/course-list";
import PageHeader from "@/components/page-header";
import Config from "@/config/config";
import { CoursesFilterParams, Pagination } from "@/lib/models";
import { useCourseFilters, useCourseList } from "@/services/course";

const CREDIT_LABEL: Record<string, string> = {
  "1": "1学分", "2": "2学分", "3": "3学分", "4": "4学分", "5plus": "5分以上",
};

const RATING_LABEL: Record<string, string> = {
  "4.5": "评分 ≥4.5", "4.0": "评分 ≥4.0", "3.5": "评分 ≥3.5", "3.0": "评分 ≥3.0",
};

const CoursesPage = () => {
  const router = useRouter();
  const { page, size, q, categories, departments, credit, min_rating, feature, onlyhasreviews } = router.query;

  // On true first load (no params at all), default sort to "最新点评"
  const defaultApplied = useRef(false);
  useEffect(() => {
    if (!router.isReady || defaultApplied.current) return;
    defaultApplied.current = true;
    if (!q && !onlyhasreviews && !departments && !categories && !credit && !min_rating && !feature) {
      router.replace({ query: { onlyhasreviews: "latest" } }, undefined, { shallow: true });
    }
  }, [router.isReady]);

  const pagination: Pagination = {
    page: page ? parseInt(page as string) : 1,
    pageSize: size ? parseInt(size as string) : Config.PAGE_SIZE,
  };

  const { courses, loading } = useCourseList(
    router.query as CoursesFilterParams,
    pagination
  );
  const { filters } = useCourseFilters();

  const onSearch = (value: string) => {
    const trimmed = value.trim();
    const newParams: Record<string, string> = { page: "1", size: String(Config.PAGE_SIZE) };
    if (trimmed) newParams.q = trimmed;
    const preserve = ["categories", "departments", "credit", "min_rating", "feature", "onlyhasreviews"];
    preserve.forEach((k) => {
      if (router.query[k]) newParams[k] = router.query[k] as string;
    });
    router.push({ query: newParams });
  };

  const onFilterChange = (key: string, value: string | null) => {
    const newParams: Record<string, string> = { page: "1", size: String(Config.PAGE_SIZE) };
    if (q) newParams.q = q as string;
    const preserve = ["categories", "departments", "credit", "min_rating", "feature", "onlyhasreviews"];
    preserve.forEach((k) => {
      if (k !== key && router.query[k]) newParams[k] = router.query[k] as string;
    });
    if (value) newParams[key] = value;
    router.push({ query: newParams });
  };

  const onPageChange = (page: number, pageSize: number) => {
    router.push({ query: { ...router.query, page, size: pageSize } });
  };

  // Build active filter chip labels for display
  const activeChips: { key: string; label: string }[] = [];
  if (departments) {
    const deptId = parseInt(departments as string);
    const dept = filters?.departments.find((d) => d.id === deptId);
    if (dept) activeChips.push({ key: "departments", label: dept.name });
  }
  if (categories) {
    const catId = parseInt(categories as string);
    const cat = filters?.categories.find((c) => c.id === catId);
    if (cat) activeChips.push({ key: "categories", label: cat.name });
  }
  if (credit) activeChips.push({ key: "credit", label: CREDIT_LABEL[credit as string] ?? (credit as string) });
  if (min_rating) activeChips.push({ key: "min_rating", label: RATING_LABEL[min_rating as string] ?? `≥${min_rating}` });
  if (feature) activeChips.push({ key: "feature", label: feature as string });
  if (onlyhasreviews) {
    const sortLabel: Record<string, string> = { latest: "最新点评", avg: "评分最高", count: "点评最多" };
    activeChips.push({
      key: "onlyhasreviews",
      label: sortLabel[onlyhasreviews as string] ?? (onlyhasreviews as string),
    });
  }

  const selected: FilterSelected = {
    departments: departments as string | undefined,
    categories: categories as string | undefined,
    credit: credit as string | undefined,
    min_rating: min_rating as string | undefined,
    feature: feature as string | undefined,
  };

  return (
    <>
      <PageHeader title="课程库" />
      <Head>
        <title>{q ? `搜索 ${q} - SWUFE选课社区` : "课程库 - SWUFE选课社区"}</title>
      </Head>

      <Input.Search
        key={(q as string) ?? ""}
        size="large"
        defaultValue={(q as string) ?? ""}
        placeholder="搜索课程名 / 课号 / 教师姓名"
        onSearch={onSearch}
        allowClear
        className="search-input"
      />

      <Row gutter={[20, 16]}>
        <Col xs={24} md={7}>
          <CourseFilterCard
            filters={filters}
            loading={!filters}
            selected={selected}
            onChange={onFilterChange}
          />
        </Col>

        <Col xs={24} md={17}>
          {/* Toolbar */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, flexWrap: "wrap", gap: 8 }}>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
              {activeChips.length === 0 && !q && (
                <span style={{ fontSize: 13, color: "#94a3b8" }}>暂未应用筛选</span>
              )}
              {activeChips.map((chip) => (
                <span key={chip.key} className="active-filter-chip">
                  {chip.label}
                  <button
                    onClick={() => onFilterChange(chip.key, null)}
                    aria-label="移除"
                  >
                    ×
                  </button>
                </span>
              ))}
              {activeChips.length > 1 && (
                <button
                  className="clear-filters-btn"
                  onClick={() => router.push({ query: { page: "1", size: String(Config.PAGE_SIZE) } })}
                >
                  清空全部
                </button>
              )}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#64748b" }}>
                <span>排序</span>
                <select
                  className="sort-select"
                  value={(onlyhasreviews as string) ?? ""}
                  onChange={(e) => {
                    const v = e.target.value;
                    onFilterChange("onlyhasreviews", v === "" ? null : v);
                  }}
                >
                  <option value="latest">最新点评</option>
                  <option value="avg">评分最高</option>
                  <option value="count">点评最多</option>
                  <option value="">全部课程</option>
                </select>
              </div>
          </div>

          <Card title={`共有${courses ? courses.count : 0}门${q ? "搜索结果" : "课"}`}>
            <CourseList
              loading={loading}
              pagination={pagination}
              count={courses?.count}
              courses={courses?.results}
              onPageChange={onPageChange}
              showEnroll
            />
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default CoursesPage;
