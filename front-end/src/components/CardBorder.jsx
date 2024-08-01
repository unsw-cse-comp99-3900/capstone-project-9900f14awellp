import React from 'react';
import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';
import { Card, Col, Row, Statistic } from 'antd';
import ShineBorder from './ShineBorder'; // 假设ShineBorder文件在同一个目录下

export const DashboardCard = () => (
    <Row gutter={16}>
    <Col span={12}>
      <ShineBorder 
      color={["black"]} 
      className="text-center text-2xl font-bold capitalize"
      >
        <Card bordered={false} style={{ width: '99%', height: '99%'}}>
          <Statistic
            title="Total Invoices"
            value={11.28}
            valueStyle={{
              color: '#3f8600',
            }}
          />
        </Card>
      </ShineBorder>
    </Col>
    <Col span={12}>
      <ShineBorder color={["black"]} className="text-center text-2xl font-bold capitalize">
        <Card bordered={false} style={{ width: '99%', height: '99%'}}>
          <Statistic
            title="Idle"
            value={9.3}
            precision={2}
            valueStyle={{
              color: '#cf1322',
            }}
            prefix={<ArrowDownOutlined />}
            suffix="%"
          />
        </Card>
      </ShineBorder>
    </Col>
  </Row>
  );
  