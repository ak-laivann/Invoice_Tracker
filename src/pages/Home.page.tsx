import styled from "styled-components";
import { DashboardPage } from "./Dashboard.page";
import { InvoiceListingPage } from "./InvoiceListing.page";
import { Card, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import { CustomPlusIcon } from "../components";
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

const CreateInvoiceCard: React.FC = () => {
  const navigate = useNavigate();
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

      <UploadText>
        Or Upload an existing invoice and set payment reminder
      </UploadText>
    </Wrapper>
  );
};
