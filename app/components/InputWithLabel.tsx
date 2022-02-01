interface Props {
  id: string
  label: string
  type?: string
  placeholder?: string
}

const InputWithLabel = ({ id, label, type = 'text', placeholder = '' }: Props) => {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-slate-500">
        {label}
      </label>
      <div className="mt-1">
        <input
          type={type}
          name={id}
          id={id}
          className="shadow-inner shadow-slate-100 bg-slate-50 focus:ring-0 focus:ring-slate-200/70 focus:border-slate-200/70 block w-full sm:text-sm border-slate-100/75 rounded-md outline-none px-3 py-2 placeholder-slate-400"
          placeholder={placeholder}
        />
      </div>
    </div>
  )
}

export default InputWithLabel