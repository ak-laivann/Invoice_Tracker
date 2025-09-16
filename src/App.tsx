import { AsyncUIWrapper } from "./components";
import { useFetchData } from "./hooks";

const useFetchAnything = () => {
  return useFetchData<any>(["testing"], "testing");
};

function App() {
  const { data, isError, error, isLoading } = useFetchAnything();
  return (
    <>
      <AsyncUIWrapper isLoading={isLoading} isError={isError} error={error}>
        {data.WTF}
      </AsyncUIWrapper>
    </>
  );
}

export default App;
