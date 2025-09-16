import React, { useState } from "react";
import { Modal, Upload, message } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import * as XLSX from "xlsx";
import type { Invoice } from "../components";
import { Card, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { CustomPlusIcon } from "../components";
import { useBatchPostInvoice } from "../hooks";
import { toast } from "react-toastify";

const { Dragger } = Upload;
const { Text } = Typography;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const StyledCard = styled(Card)`
  && {
    border-radius: 0.75rem;
    border: none;
    background: #f9f9f9;
    text-align: center;
    padding: 2rem 1.5rem;
    width: 100%;
    box-shadow: none;
  }

  .ant-card-body {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
`;

const UploadText = styled(Text)`
  && {
    display: block;
    margin-top: 1rem;
    color: #9333ea;
    font-size: 14px;
    cursor: pointer;
    &:hover {
      text-decoration: underline;
    }
  }
`;

export const CreateInvoiceCard: React.FC<{
  onBatchUploadSuccess: () => void;
}> = ({ onBatchUploadSuccess }) => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <Wrapper>
      <StyledCard
        className="flex flex-col justify-center items-center"
        onClick={() => navigate("/invoices/add")}
      >
        <CustomPlusIcon />
        <p className="bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
          Create New Invoice
        </p>
        <Text type="secondary">Start by creating and sending new invoice</Text>
      </StyledCard>

      <UploadText onClick={() => setIsModalOpen(true)}>
        Or Upload an existing invoice and set payment reminder
      </UploadText>

      <UploadInvoiceModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        onSuccess={onBatchUploadSuccess}
      />
    </Wrapper>
  );
};

interface UploadInvoiceModalProps {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onSuccess: () => void;
}

export const UploadInvoiceModal: React.FC<UploadInvoiceModalProps> = ({
  isModalOpen,
  setIsModalOpen,
  onSuccess,
}) => {
  const [fileList, setFileList] = useState<any[]>([]);
  const mutation = useBatchPostInvoice(setIsModalOpen, setFileList, onSuccess);

  const handleUpload = async () => {
    if (fileList.length === 0) {
      toast.error("Please select a file first");
      return;
    }

    const file = fileList[0];

    if (!(file instanceof File)) {
      toast.error("File not valid");
      return;
    }

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);

      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet, {
        defval: "",
      });

      const invoices: Invoice[] = jsonData.map((row: any) => {
        return {
          clientId: row["Client Id"] || "",
          id: row["Invoice ID"] || "",
          clientName: row["Client Name"] || "",
          price: {
            currency: row["Currency"] || "INR",
            value: Number(row["Value"]) || 0,
          },
          date: row["Date"] || "",
          status: row["Status"] || "NONE",
          submissionStatus: row["Submission Status"] || "DRAFT",
        };
      });

      mutation.mutate(invoices);
    } catch (err) {
      toast.error("Failed to read the Excel file");
      console.error(err);
    }
  };

  const uploadProps = {
    onRemove: (file: any) => setFileList([]),
    beforeUpload: (file: any) => {
      const isXlsx =
        file.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
      if (!isXlsx) {
        message.error(`${file.name} is not an .xlsx file`);
      } else {
        setFileList([file]);
      }
      return false;
    },
    fileList,
    accept: ".xlsx",
  };

  return (
    <Modal
      title="Upload Invoices"
      open={isModalOpen}
      onCancel={() => setIsModalOpen(false)}
      onOk={handleUpload}
      okText="Upload"
      okButtonProps={{
        disabled: mutation.isPending,
        loading: mutation.isPending,
      }}
      cancelButtonProps={{
        disabled: mutation.isPending,
      }}
    >
      <Dragger {...uploadProps} style={{ padding: "1rem" }}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">
          Click or drag file to this area to upload
        </p>
        <p className="ant-upload-hint">Only .xlsx files are supported</p>
      </Dragger>
    </Modal>
  );
};
