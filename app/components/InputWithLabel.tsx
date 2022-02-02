import type { ChangeEvent } from "react";

interface Props {
  id: string;
  label: string;
  value?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  placeholder?: string;
  classNames?: string;
}

const InputWithLabel = ({
  id,
  label,
  value = "",
  onChange = () => {},
  type = "text",
  placeholder = "",
  classNames = "",
}: Props) => {
  return (
    <div className={classNames}>
      <label htmlFor={id} className="block text-sm font-medium text-slate-500">
        {label}
      </label>
      <div className="mt-1">
        <input
          type={type}
          name={id}
          id={id}
          className="block w-full px-3 py-2 rounded-md shadow-inner outline-none shadow-slate-100 bg-slate-50 focus:ring-0 focus:ring-slate-200/70 focus:border-slate-200/70 sm:text-sm border-slate-100/75 placeholder-slate-400"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
      </div>
    </div>
  );
};

export default InputWithLabel;
