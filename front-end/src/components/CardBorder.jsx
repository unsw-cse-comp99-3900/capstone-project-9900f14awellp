import React from 'react';
import { Card, Col, Row, Statistic } from 'antd';
import ShineBorder from './ShineBorder'; // 假设ShineBorder文件在同一个目录下

export const DashboardCard = ({total, success,fail,unvalidated}) => (
  <Row gutter={16}>
    <Col span={6}>
      <ShineBorder 
       color={["#FFF5E7", "#D5F9EF", "#FED5D4"]}
      className="text-center text-2xl font-bold capitalize"
      >
        <Card bordered={false} style={{ width: '100%', height: '100%'}}>
          <Statistic
            title="Total Invoices"
            value={total}
            valueStyle={{
              color: '#3f8600',
            }}
          />
        </Card>
      </ShineBorder>
    </Col>
    <Col span={6}>
      <ShineBorder  color={["#FFF5E7", "#D5F9EF", "#FED5D4"]} className="text-center text-2xl font-bold capitalize">
        <Card bordered={false} style={{ width: '100%', height: '100%'}}>
          <Statistic
            title="Validation Successful Invoices"
            value={success}
            valueStyle={{
              color: '#cf1322',
            }}
          />
        </Card>
      </ShineBorder>
    </Col>
    <Col span={6}>
      <ShineBorder  color={["#FFF5E7", "#D5F9EF", "#FED5D4"]} className="text-center text-2xl font-bold capitalize">
        <Card bordered={false} style={{ width: '100%', height: '100%'}}>
          <Statistic
            title="Validation failed Invoices"
            value={fail}
            valueStyle={{
              color: '#cf1322',
            }}
          />
        </Card>
      </ShineBorder>
    </Col>
    <Col span={6}>
      <ShineBorder  color={["#FFF5E7", "#D5F9EF", "#FED5D4"]} className="text-center text-2xl font-bold capitalize">
        <Card bordered={false} style={{ width: '100%', height: '100%'}}>
          <Statistic
            title="Unvalidated Invoices"
            value={unvalidated}
            valueStyle={{
              color: '#cf1322',
            }}
          />
        </Card>
      </ShineBorder>
    </Col>
  </Row>
);

export default DashboardCard;
