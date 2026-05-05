import { Card, Col, Grid, Row, Statistic } from "antd";
import Head from "next/head";
import {
  Bar,
  BarChart,
  Brush,
  Label,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import PageHeader from "@/components/page-header";
import { useStatistic } from "@/services/statistic";

const { useBreakpoint } = Grid;

const IntervalAxisTick = ({ x, y, payload }: any) => {
  console.log(x, y, payload);

  return (
    <g transform={`translate(${x + 8},${y})`}>
      <text y={0} dy={12} textAnchor="end" fill="#666">
        {payload.value < 5 ? `[${payload.value}, ${payload.value + 1})` : 5}
      </text>
    </g>
  );
};

// 地理分布图表的颜色配置
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#FF7C7C', '#8DD1E1', '#D084D0'];

const StatisticPage = () => {
  const { indexState, loading } = useStatistic();

  const screens = useBreakpoint();
  // 移动端响应式布局优化
  const numberColSpan = screens.lg ? 4 : screens.md ? 6 : screens.sm ? 8 : 12;
  const figureColSpan = screens.lg ? 12 : screens.md ? 12 : 24;
  const chartHeight = screens.xs ? 150 : screens.sm ? 180 : 200;
  const chartMargin = screens.xs 
    ? { left: 0, right: 0, top: 0, bottom: 0 }
    : { left: 0, right: 0, top: 5, bottom: 5 };
  return (
    <>
      <Head>
        <title>统计 - SWUFE选课社区</title>
      </Head>
      <PageHeader title="统计" />
      <Card title="基本统计">
        <Row
          className="info-row"
          gutter={[16, 16]}
          justify="center"
          align="middle"
        >
          <Col span={numberColSpan}>
            <Statistic
              title="用户总数"
              loading={loading}
              value={indexState?.user_count}
            />
          </Col>
          <Col span={numberColSpan}>
            <Statistic
              title="用户新增"
              loading={loading}
              value={indexState?.daily_new_users}
            />
          </Col>
          <Col span={numberColSpan}>
            <Statistic
              title="点评总数"
              loading={loading}
              value={indexState?.review_count}
            />
          </Col>

          <Col span={numberColSpan}>
            <Statistic
              title="点评新增"
              loading={loading}
              value={indexState?.daily_new_reviews}
            />
          </Col>
          <Col span={numberColSpan}>
            <Statistic
              title="课程总数"
              loading={loading}
              value={indexState?.course_count}
            />
          </Col>
          <Col span={numberColSpan}>
            <Statistic
              title="已点评课程数"
              loading={loading}
              value={indexState?.course_with_review_count}
            />
          </Col>
          <Col span={numberColSpan}>
            <Statistic
              title="今日访客"
              loading={loading}
              value={indexState?.today_visitors}
              suffix="人"
            />
          </Col>
          <Col span={numberColSpan}>
            <Statistic
              title="总访客数"
              loading={loading}
              value={indexState?.total_visitors}
              suffix="人"
            />
          </Col>
        </Row>
      </Card>

      <Row gutter={[16, 16]}>
        <Col span={figureColSpan}>
          <Card title="点评推荐指数分布">
            <ResponsiveContainer height={chartHeight}>
              <BarChart
                data={indexState?.review_rating_dist || []}
                margin={chartMargin}
              >
                <XAxis dataKey="value">
                  <Label value="推荐指数" offset={0} position="insideBottom" />
                </XAxis>
                <YAxis />
                <Tooltip />
                <Bar name="点评数量" dataKey="count" fill="#adc6ff"></Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col span={figureColSpan}>
          <Card title="课程推荐指数分布">
            <ResponsiveContainer height={chartHeight}>
              <BarChart
                data={indexState?.course_review_avg_dist || []}
                margin={{ left: 0, right: 0, top: 5, bottom: 5 }}
              >
                <XAxis dataKey="value" tick={IntervalAxisTick}>
                  <Label value="推荐指数" offset={0} position="insideBottom" />
                </XAxis>
                <YAxis />
                <Tooltip />
                <Bar name="课程数量" dataKey="count" fill="#adc6ff" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card title="课程点评数量分布">
            <ResponsiveContainer height={chartHeight}>
              <BarChart
                data={indexState?.course_review_count_dist || []}
                margin={{ left: 0, right: 0, top: 5, bottom: 5 }}
              >
                <XAxis dataKey="value">
                  <Label value="点评数量" offset={0} position="insideBottom" />
                </XAxis>
                <YAxis />
                <Tooltip />
                <Bar name="课程数量" dataKey="count" fill="#adc6ff"></Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col span={figureColSpan}>
          <Card title="新增用户">
            <ResponsiveContainer height={chartHeight}>
              <LineChart
                data={indexState?.user_join_time || []}
                margin={{ left: 0, right: 0, top: 5, bottom: 5 }}
              >
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="count" dot={false} />
                <Brush />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col span={figureColSpan}>
          <Card title="新增点评">
            <ResponsiveContainer height={chartHeight}>
              <LineChart
                data={indexState?.review_create_time || []}
                margin={{ left: 0, right: 0, top: 5, bottom: 5 }}
              >
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="count" dot={false} />
                <Brush />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>
      
      {/* 访问统计图表 */}
      <Row gutter={[16, 16]}>
        <Col span={figureColSpan}>
          <Card title="每日访客统计">
            <ResponsiveContainer height={chartHeight}>
              <LineChart
                data={indexState?.visitor_daily_stats || []}
                margin={{ left: 0, right: 0, top: 5, bottom: 5 }}
              >
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#8884d8" dot={false} />
                <Brush />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col span={figureColSpan}>
          <Card title="访客地理分布">
            <ResponsiveContainer height={chartHeight}>
              <PieChart>
                <Pie
                  data={indexState?.country_distribution || []}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }: any) => 
                    screens.xs ? (percent > 0.1 ? name : '') : `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={screens.xs ? 60 : 80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {(indexState?.country_distribution || []).map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>
      
      {/* 城市分布 */}
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card title="热门访问城市">
            <ResponsiveContainer height={chartHeight}>
              <BarChart
                data={indexState?.city_distribution || []}
                margin={{ left: 0, right: 0, top: 5, bottom: 5 }}
              >
                <XAxis dataKey="name">
                  <Label value="城市" offset={0} position="insideBottom" />
                </XAxis>
                <YAxis />
                <Tooltip />
                <Bar name="访客数量" dataKey="count" fill="#adc6ff"></Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default StatisticPage;
