import { Log, LogItem } from '@src/global/types/Log';
import { List, message, Typography } from 'antd';
import { FC } from 'react';

interface LogListProps {
  log: Log;
}

const LogList: FC<LogListProps> = ({ log }) => {
  const [messageApi, contextHolder] = message.useMessage();

  return (
    <div>
      {contextHolder}
      <List<LogItem>
        size='large'
        bordered
        dataSource={log}
        renderItem={(item: LogItem) => (
          <List.Item>
            <Typography.Text mark>Code:</Typography.Text>{' '}
            <p style={{ whiteSpace: 'pre-line' }}>{item[0]}</p>
            <Typography.Text mark>Result:</Typography.Text>{' '}
            <p style={{ whiteSpace: 'pre-line' }}>{item[1]}</p>
          </List.Item>
        )}
      />
    </div>
  );
};

export default LogList;
