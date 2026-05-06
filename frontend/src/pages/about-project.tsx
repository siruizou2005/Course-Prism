import { Card, Col, Row, Space, Typography, Avatar, Button, Divider, Modal, message } from "antd";
import { GithubOutlined, MailOutlined, QqOutlined, WechatOutlined, GlobalOutlined } from "@ant-design/icons";
import Head from "next/head";
import { useAboutData } from "@/services/about";
import { useState } from "react";

const { Title, Paragraph, Text } = Typography;

interface TeamMember {
  id: number;
  name: string;
  role: string;
  class_name: string;
  description: string;
  avatar_url: string;
  github: string;
  qq: string;
  wechat: string;
  email: string;
  website: string;
  order: number;
}

interface Contributor {
  id: number;
  name: string;
  class_name: string;
  contribution_type: string;
  contribution_type_display: string;
  description: string;
  avatar: string;
  github: string;
  contributions: number;
}

const AboutProjectPage = () => {
  const { aboutData, error } = useAboutData();
  const [contactModalVisible, setContactModalVisible] = useState(false);
  const [contactInfo, setContactInfo] = useState<{type: string; value: string; name: string}>({ type: '', value: '', name: '' });

  const showContactModal = (type: string, value: string, name: string) => {
    setContactInfo({ type, value, name });
    setContactModalVisible(true);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      message.success('已复制到剪贴板');
    } catch (err) {
      message.error('复制失败');
    }
  };

  return (
    <>
      <Head>
        <title>关于项目 - SWUFE选课社区</title>
      </Head>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "24px" }}>
        {/* 项目介绍 */}
        <Card style={{ marginBottom: 24 }}>
          <Title level={2}>项目介绍</Title>
          <Paragraph>
            SWUFE选课社区是一个专为西南财经大学学生打造的课程评价与选课参考平台。
            我们致力于为同学们提供真实、全面的课程信息和教师评价，帮助大家做出更好的选课决策。
          </Paragraph>
          <Paragraph>
            本平台采用匿名评价机制，保护用户隐私的同时确保评价内容的真实性和客观性。
            所有评价均来自真实的选课体验，为学弟学妹们提供最有价值的参考信息。
          </Paragraph>
        </Card>

        {/* 愿景 */}
        <Card style={{ marginBottom: 24 }}>
          <Title level={2}>我们的愿景</Title>
          <Paragraph>
            <Text strong>让每一门课程都被公正评价，让每一个选择都有据可依。</Text>
          </Paragraph>
          <Paragraph>
            我们希望通过这个平台，构建一个开放、透明、互助的学习社区，
            让同学们能够：
          </Paragraph>
          <ul>
            <li>获得真实的课程体验分享</li>
            <li>了解教师的教学风格和特点</li>
            <li>做出更适合自己的选课决策</li>
            <li>为学弟学妹留下宝贵的经验</li>
          </ul>
        </Card>

        {/* 开发团队 */}
        <Card style={{ marginBottom: 24 }}>
          <Title level={2}>开发团队</Title>
          {aboutData?.team_members && aboutData.team_members.length > 0 ? (
            <Row gutter={[16, 16]}>
              {aboutData.team_members.map((member) => (
                <Col xs={24} sm={12} md={8} lg={6} xl={4.8} key={member.id}>
                  <Card size="small">
                    <Space direction="vertical" style={{ width: "100%", textAlign: "center" }}>
                      <Avatar 
                        size={64} 
                        src={member.avatar_url} 
                        style={{ backgroundColor: '#1890ff' }}
                      >
                        {member.name[0]}
                      </Avatar>
                      <div>
                        <Text strong>{member.name}</Text>
                        <br />
                        <Text type="secondary">{member.role}</Text>
                        {member.class_name && (
                          <>
                            <br />
                            <Text type="secondary" style={{ fontSize: "12px" }}>
                              {member.class_name}
                            </Text>
                          </>
                        )}
                      </div>
                      {member.description && (
                        <Paragraph 
                          style={{ fontSize: "12px", margin: 0 }}
                          ellipsis={{ rows: 2 }}
                        >
                          {member.description}
                        </Paragraph>
                      )}
                      <Space wrap>
                        {member.github && (
                          <Button 
                            type="text" 
                            icon={<GithubOutlined />}
                            href={`https://github.com/${member.github}`}
                            target="_blank"
                            size="small"
                          />
                        )}
                        {member.qq && (
                          <Button 
                            type="text" 
                            icon={<QqOutlined />}
                            onClick={() => showContactModal('QQ', member.qq, member.name)}
                            size="small"
                          />
                        )}
                        {member.wechat && (
                          <Button 
                            type="text" 
                            icon={<WechatOutlined />}
                            onClick={() => showContactModal('微信', member.wechat, member.name)}
                            size="small"
                          />
                        )}
                        {member.email && (
                          <Button 
                            type="text" 
                            icon={<MailOutlined />}
                            onClick={() => showContactModal('邮箱', member.email, member.name)}
                            size="small"
                          />
                        )}
                        {member.website && (
                          <Button 
                            type="text" 
                            icon={<GlobalOutlined />}
                            href={member.website}
                            target="_blank"
                            size="small"
                          />
                        )}
                      </Space>
                    </Space>
                  </Card>
                </Col>
              ))}
            </Row>
          ) : (
            <Paragraph type="secondary">
              团队信息正在完善中...
            </Paragraph>
          )}
        </Card>

        {/* 贡献者 */}
        <Card>
          <Title level={2}>贡献者</Title>
          <Paragraph type="secondary">
            感谢所有为项目做出贡献的同学们！
          </Paragraph>
          
          {aboutData?.contributors && aboutData.contributors.length > 0 ? (
            <div>
              {/* 按贡献类型分组显示 */}
              {Object.entries(
                aboutData.contributors.reduce((groups: Record<string, Contributor[]>, contributor) => {
                  const type = contributor.contribution_type_display;
                  if (!groups[type]) groups[type] = [];
                  groups[type].push(contributor);
                  return groups;
                }, {})
              ).map(([type, contributors]) => (
                <div key={type} style={{ marginBottom: 16 }}>
                  <Title level={4}>{type}</Title>
                  <Row gutter={[8, 8]}>
                    {contributors.map((contributor) => (
                      <Col key={contributor.id}>
                        <Space>
                          <Avatar 
                            size="small" 
                            src={contributor.avatar}
                            style={{ backgroundColor: '#52c41a' }}
                          >
                            {contributor.name[0]}
                          </Avatar>
                          <Space direction="vertical" size={0}>
                            <Text>{contributor.name}</Text>
                            {contributor.class_name && (
                              <Text type="secondary" style={{ fontSize: '11px' }}>
                                {contributor.class_name}
                              </Text>
                            )}
                            {contributor.contributions > 1 && (
                              <Text type="secondary" style={{ fontSize: '12px' }}>
                                {contributor.contributions} 次贡献
                              </Text>
                            )}
                          </Space>
                          {contributor.github && (
                            <Button 
                              type="text" 
                              icon={<GithubOutlined />}
                              href={`https://github.com/${contributor.github}`}
                              target="_blank"
                              size="small"
                            />
                          )}
                        </Space>
                      </Col>
                    ))}
                  </Row>
                  {type !== Object.keys(aboutData.contributors.reduce((groups: Record<string, Contributor[]>, contributor) => {
                    const type = contributor.contribution_type_display;
                    if (!groups[type]) groups[type] = [];
                    groups[type].push(contributor);
                    return groups;
                  }, {})).pop() && <Divider />}
                </div>
              ))}
            </div>
          ) : (
            <Paragraph type="secondary">
              贡献者信息正在完善中...
            </Paragraph>
          )}
        </Card>
      </div>

      {/* 联系信息弹窗 */}
      <Modal
        title={`${contactInfo.name} 的${contactInfo.type}联系方式`}
        open={contactModalVisible}
        onCancel={() => setContactModalVisible(false)}
        footer={[
          <Button key="copy" type="primary" onClick={() => copyToClipboard(contactInfo.value)}>
            复制到剪贴板
          </Button>,
          <Button key="close" onClick={() => setContactModalVisible(false)}>
            关闭
          </Button>
        ]}
        centered
      >
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <Text style={{ fontSize: '18px', fontWeight: 'bold' }}>
            {contactInfo.value}
          </Text>
          <div style={{ marginTop: '16px' }}>
            <Text type="secondary">
              点击"复制到剪贴板"按钮可快速复制联系方式
            </Text>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default AboutProjectPage;