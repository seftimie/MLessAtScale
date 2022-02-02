import Image from "next/image";

interface Props {
  icon: string;
  children?: React.ReactNode;
}

const FormBox = ({ icon, children }: Props) => {
  return (
    <div className="shadow-2xl shadow-indigo-200 p-6 flex rounded-xl bg-white items-center">
      <div className="mr-8">
        <Image src={icon} alt="bq" width={50} height={50} />
      </div>
      {children}
    </div>
  );
};

export default FormBox;
