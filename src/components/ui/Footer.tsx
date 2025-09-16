import { SparkonomyLogo } from "./SparkonomyLogo";

export const Footer = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center pb-4 pt-12">
      <SparkonomyLogo />
      <p className="font-roboto font-normal text-[10px] leading-[140%] tracking-normal text-center text-[#999999]">
        sparking the creator economy
      </p>
    </div>
  );
};
