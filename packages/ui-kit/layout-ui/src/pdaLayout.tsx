import { Layout } from "antd";
import { useTheme } from "antd-style";
import ErrorBoundary from "antd/es/alert/ErrorBoundary";
import React from "react";
import { Outlet, useLocation } from "react-router-dom";

import LayoutHeader from "./header/pdaHeader";

interface IProps {
  children?: React.ReactNode;
  menuNodes?: React.ReactNode;
  footer?: React.ReactNode;
  title?: string;
}

export const PdaLayout = (props: IProps) => {
  const { title } = props;
  const { state } = useLocation();
  const token = useTheme();
  console.log(token);

  const { key = "key" } = state || {};
  const { Content } = Layout;
  const location = useLocation();
  return (
    <Layout className="max-w-[750px] m-auto h-full bg-gradient-to-b from-[#F2F4F9] to-[#E6EAF4]">
      <LayoutHeader title={title} />
      <Content className="overflow-y-auto">
        {/* <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            // exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          > */}
        <ErrorBoundary>
          <Outlet key={key} />
        </ErrorBoundary>
        {/* </motion.div>
        </AnimatePresence> */}
      </Content>
    </Layout>
  );
};
