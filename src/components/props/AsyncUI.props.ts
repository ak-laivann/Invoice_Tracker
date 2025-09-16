export interface AsyncUIWrapperProps {
  isLoading: boolean;
  isError: boolean;
  children: React.ReactNode;
  error: Error | null;
}
