import LogList from '@src/components/general/LogList';
import { Log } from '@src/global/types/Log';
import { taskRunner } from '@src/global/utils/taskRunner';
import { Button, Form, Input } from 'antd';
import Head from 'next/head';
import { useEffect, useState } from 'react';

import styles from './Home.module.css';

const { Item } = Form;

interface Values {
  password: string;
}

function HomeContent() {
  const [password, setPassword] = useState<string | null>(null);
  const [log, setLog] = useState<Log | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function login() {
      setIsLoading(true);
      const response = await fetch('/api/start', {
        method: 'POST',
        body: JSON.stringify({ password }),
        mode: 'cors',
        credentials: 'include',
      });
      const newLog = await response.json();
      setIsLoading(false);
      setLog(newLog);
    }

    if (password === null) {
      return;
    }

    const { run, stop } = taskRunner(login, 3000);

    run();

    return stop;
  }, [password]);

  useEffect(() => {
    setPassword(localStorage.getItem('exo-password'));
  }, []);

  const onFinish = (values: Values) => {
    localStorage.setItem('exo-password', values.password);
    setPassword(values.password);
  };

  if (!log) {
    return (
      <main className={styles.root}>
        <Form
          name='basic'
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          autoComplete='on'
          disabled={isLoading}
        >
          <Item
            label='Password'
            name='password'
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password />
          </Item>

          <Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type='primary' htmlType='submit'>
              Submit
            </Button>
          </Item>
        </Form>
      </main>
    );
  }

  return <LogList log={log} />;
}

export default function Home() {
  return (
    <>
      <Head>
        <title>EZO JS Compiler</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <HomeContent />
    </>
  );
}
