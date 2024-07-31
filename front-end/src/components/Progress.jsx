import React from 'react';
import { Flex, Progress } from 'antd';
const Colors = {
    '0%': '#ffccc7',
    '50%': '#ffe58f',
    '100%': '#87d068',
  };
export const Progress = ({percent}) => (
    
  <Flex
    vertical
    gap="small"
    style={{
      width: 180,
    }}
  >
    if ()
    <Progress percent={30} size="small" />
    <Progress percent={50} size="small" status="active" />
    <Progress percent={70} size="small" strokeColor={Colors} />
    <Progress percent={100} size="small" />
  </Flex>
);
