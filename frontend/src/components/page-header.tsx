import { ArrowLeftOutlined } from "@ant-design/icons";
import { Button, Col, Row, Space, Typography, Grid } from "antd";
import React from "react";

const { Text } = Typography;
const { useBreakpoint } = Grid;

const PageHeader = ({
  title,
  subTitle,
  onBack,
  extra,
}: {
  title: string | React.ReactNode;
  subTitle?: string;
  onBack?: () => void;
  extra?: React.ReactNode;
}) => {
  const screens = useBreakpoint();
  
  // 在移动端，额外内容可能需要换行显示
  if (!screens.md && extra) {
    return (
      <>
        <Row
          style={{ marginTop: 16, marginBottom: 8, alignItems: "center" }}
          gutter={[8, 8]}
        >
          {onBack && (
            <Col>
              <Button
                type="text"
                shape="circle"
                onClick={onBack}
                icon={<ArrowLeftOutlined />}
              />
            </Col>
          )}
          {title && (
            <Col flex="auto">
              <Text style={{ fontSize: screens.xs ? "18px" : "20px", fontWeight: 600 }}>
                {title}
              </Text>
            </Col>
          )}
        </Row>
        {subTitle && (
          <Row style={{ marginBottom: 8 }}>
            <Col span={24}>
              <Text type="secondary" style={{ fontSize: screens.xs ? "12px" : "14px" }}>
                {subTitle}
              </Text>
            </Col>
          </Row>
        )}
        <Row style={{ marginBottom: 16 }}>
          <Col span={24}>
            {extra}
          </Col>
        </Row>
      </>
    );
  }

  return (
    <Row
      style={{ marginTop: 16, marginBottom: 16, alignItems: "center" }}
      gutter={[16, 8]}
    >
      {onBack && (
        <Col>
          <Button
            type="text"
            shape="circle"
            onClick={onBack}
            icon={<ArrowLeftOutlined />}
          />
        </Col>
      )}
      {title && (
        <Col>
          <Text style={{ fontSize: screens.xs ? "18px" : "20px", fontWeight: 600 }}>
            {title}
          </Text>
        </Col>
      )}
      {subTitle && (
        <Col flex="auto">
          <Text type="secondary" style={{ fontSize: screens.xs ? "12px" : "14px" }}>
            {subTitle}
          </Text>
        </Col>
      )}
      {extra && <Col>{extra}</Col>}
    </Row>
  );
};

export default PageHeader;
