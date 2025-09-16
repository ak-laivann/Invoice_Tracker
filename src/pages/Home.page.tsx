import styled from "styled-components";
import { DashboardPage } from "./Dashboard.page";
import { InvoiceListingPage } from "./InvoiceListing.page";
import { Card, Typography } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
const { Text } = Typography;
export const HomePage = () => {
  return (
    <>
      <CreateInvoiceCard />
      <br />
      <DashboardPage />
      <br />
      <InvoiceListingPage />
    </>
  );
};

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
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;

  .anticon {
    font-size: 48px;
    background: linear-gradient(90deg, #a855f7, #3b82f6);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
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

const CreateInvoiceCard: React.FC = () => {
  const navigate = useNavigate();
  return (
    <Wrapper onClick={() => navigate("/invoices/add")}>
      <StyledCard>
        <IconWrapper>
          <PlusOutlined />
        </IconWrapper>
        <p className="bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
          Create New Invoice
        </p>
        <Text type="secondary">Start by creating and sending new invoice</Text>
      </StyledCard>

      <UploadText>
        Or Upload an existing invoice and set payment reminder
      </UploadText>
    </Wrapper>
  );
};
