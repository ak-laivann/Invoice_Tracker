import React from "react";
import { DatePicker, Tooltip, Card, Row, Col } from "antd";
import { DualAxes } from "@ant-design/plots";
import { CrownOutlined, CalendarOutlined } from "@ant-design/icons";
import type { MetricsCardData, MoMData } from "../props";

export const MoMInvoiceChart = React.memo((props: { data: MoMData[] }) => {
  const config = {
    data: [props.data, props.data],
    xField: "month",
    yField: ["income", "momGrowth"],
    geometryOptions: [
      {
        geometry: "column",
        columnWidthRatio: 0.6,
        color: "#52c41a",
      },
      {
        geometry: "line",
        smooth: true,
        color: "#1890ff",
        lineStyle: { lineWidth: 2 },
        point: { size: 4, shape: "circle" },
      },
    ],
    yAxis: {
      paid: { title: { text: "Earnings" } },
      momGrowth: {
        title: { text: "MoM Growth (%)" },
        min: 0,
        max: 100,
      },
    },
    tooltip: {
      showMarkers: true,
      shared: true,
    },
    legend: { position: "top-left" },
  };

  return <DualAxes {...config} />;
});

type Period = "1M" | "3M" | "1Y" | "CUSTOM";

export const TimePeriodSelector = React.memo(
  ({
    value,
    onChange,
  }: {
    value: Period;
    onChange: (val: Period, range?: [Date, Date]) => void;
  }) => {
    return (
      <div className="border rounded-xl p-4 bg-white">
        <div className="flex flex-col lg:flex-row lg:items-center lg:gap-3 gap-3">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => onChange("1M")}
              className={`px-4 py-1.5 rounded-full border text-sm ${
                value === "1M"
                  ? "bg-purple-100 text-purple-700 border-purple-700"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
              }`}
            >
              1 Month
            </button>

            <button
              onClick={() => onChange("3M")}
              className={`px-4 py-1.5 rounded-full border text-sm ${
                value === "3M"
                  ? "bg-purple-100 text-purple-700 border-purple-700"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
              }`}
            >
              3 Months
            </button>
          </div>

          <div className="flex flex-wrap gap-3">
            <Tooltip title="Available with Pro Subscription">
              <button
                disabled
                className={`px-4 py-1.5 rounded-full border text-sm flex items-center gap-1 ${
                  value === "1Y"
                    ? "bg-purple-100 text-purple-700 border-purple-700"
                    : "bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed"
                }`}
              >
                1 Year <CrownOutlined className="text-yellow-500" />
              </button>
            </Tooltip>

            <DatePicker.RangePicker
              allowClear={false}
              className="rounded-full px-3 py-1.5 border border-gray-300 text-sm hover:border-purple-500"
              onChange={(dates) => {
                if (dates && dates[0] && dates[1]) {
                  onChange("CUSTOM", [dates[0].toDate(), dates[1].toDate()]);
                }
              }}
              suffixIcon={<CalendarOutlined className="text-gray-500" />}
            />
          </div>
        </div>
      </div>
    );
  }
);

export const DashboardMetricsCard = React.memo(
  ({ totalEarnings, paymentAwaited, paymentOverDue }: MetricsCardData) => {
    const metricCards = [
      { title: "Total Earnings", value: totalEarnings },
      { title: "Payment Awaited", value: paymentAwaited },
      { title: "Payment Overdue", value: paymentOverDue },
    ];

    return (
      <div>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={8}>
            <Card>
              <div style={{ fontWeight: "bold" }}>{metricCards[0].title}</div>
              <div style={{ fontSize: "1.5rem" }}>{metricCards[0].value}</div>
            </Card>
          </Col>

          <Col xs={12} md={8}>
            <Card>
              <div style={{ fontWeight: "bold" }}>{metricCards[1].title}</div>
              <div style={{ fontSize: "1.5rem" }}>{metricCards[1].value}</div>
            </Card>
          </Col>
          <Col xs={12} md={8}>
            <Card>
              <div style={{ fontWeight: "bold" }}>{metricCards[2].title}</div>
              <div style={{ fontSize: "1.5rem" }}>{metricCards[2].value}</div>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
);
