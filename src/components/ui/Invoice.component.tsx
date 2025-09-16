import React from "react";
import { Invoice_Status, Submission_Status, type Invoice } from "../props";
import { Card, Dropdown, Menu, Tag, Typography } from "antd";
import {
  BellTwoTone,
  CaretDownFilled,
  DownOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import styled from "styled-components";

const { Text } = Typography;

const CardWrapper = styled(Card)`
  margin-bottom: 12px;
  border-radius: 12px;

  .ant-card-body {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;

    &::before,
    &::after {
      content: none !important;
    }
  }
`;

const StatusTag = styled(Tag)<{ $status: string }>`
  font-size: 12px;
  padding: 2px 10px;
  border: none;
  ${({ $status }) =>
    $status === Invoice_Status.PAID &&
    `
    color: #34C759;
    background: #9CEFB8;
  `}
  ${({ $status }) =>
    $status === Invoice_Status.PARTIALLY_PAID &&
    `
      color: #FFD015;
      background: #FFFAE5;
  `}
  ${({ $status }) =>
    $status === Invoice_Status.AWAITED &&
    `
      color: #FFD015;
      background: #FFFAE5;
  `}
  ${({ $status }) =>
    $status === Invoice_Status.DISPUTED &&
    `
    color: #FF2D55;
    background: #FFB1B1;
  `}
  ${({ $status }) =>
    $status === Invoice_Status.OVERDUE &&
    `
    color: #FF2D55;
    background: #FFB1B1;
  `}
`;

export const InvoiceCard = React.memo(
  (props: {
    data: Invoice;
    onStatusChange?: (id: string, status: string) => void;
  }) => {
    const { id, clientName, price, date, status } = props.data;

    const menu = (
      <Menu
        onClick={({ key }) => props.onStatusChange?.(id, key)}
        items={[
          { key: "Paid", label: "Paid" },
          { key: "Unpaid", label: "Unpaid" },
          { key: "Disputed", label: "Disputed" },
          { key: "Partially Paid", label: "Partially Paid" },
          { key: "Overdue", label: "Overdue" },
        ]}
      />
    );

    console.log(props.data.status);

    return (
      <CardWrapper>
        <div>
          <Text strong>{clientName}</Text>
          <br />
          <Text type="secondary">
            {price.currency} {price.value}, Due:{" "}
            {new Date(date!).toISOString().split("T")[0]}
          </Text>
        </div>

        <div>
          {props.data.submissionStatus === Submission_Status.DRAFT ? (
            <div className="flex items-center">
              <Tag className="border-none pt-1 pb-1 pl-3 pr-2 bg-[#F2F2F2] color-[#999999] rounded-full">
                {Submission_Status.DRAFT}
              </Tag>
              <EditOutlined style={{ fontSize: "18px" }} />
            </div>
          ) : props.data.submissionStatus === Submission_Status.PUBLISHED &&
            props.data.status === Invoice_Status.NONE ? (
            <Dropdown overlay={menu} trigger={["click"]}>
              <Tag
                className="pt-2 pb-2 pl-3 pr-3 text-white rounded-full bg-[#8134AF]"
                onClick={(e) => e.preventDefault()}
              >
                <b>Update Status </b>
                <CaretDownFilled style={{ color: "white" }} />
              </Tag>
            </Dropdown>
          ) : (
            <div className="flex items-center">
              <StatusTag
                className="pt-3 pb-3 pl-3 pr-2 rounded-full"
                $status={status}
              >
                {Invoice_Status[status]}
              </StatusTag>
              {props.data.status === Invoice_Status.OVERDUE ||
              props.data.status === Invoice_Status.AWAITED ? (
                <BellTwoTone style={{ fontSize: "18px" }} />
              ) : null}
            </div>
          )}
        </div>
      </CardWrapper>
    );
  }
);

export const InvoiceListingComponent = React.memo(
  (props: {
    invoices?: Invoice[];
    onStatusChange?: (id: string, status: string) => void;
  }) => {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {props?.invoices?.map((invoice) => (
          <InvoiceCard
            key={invoice?.id}
            data={invoice}
            onStatusChange={props.onStatusChange}
          />
        ))}
      </div>
    );
  }
);
