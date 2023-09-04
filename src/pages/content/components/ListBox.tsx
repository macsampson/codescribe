import { Listbox } from "@headlessui/react";
import { ChevronUpDownIcon } from "@heroicons/react/24/outline";
import { Option } from "@src/types";

interface ListboxProps {
  label: string;
  value: Option;
  onChange: React.Dispatch<React.SetStateAction<Option>>;
  options: Option[];
  icon?: JSX.Element;
}

// ListboxComponent
const ListboxComponent: React.FC<ListboxProps> = ({
  label,
  value,
  onChange,
  options,
  icon,
}) => (
  <div className="flex-col">
    <label className="block text-gray-500 font-bold mb-1 text-center w-35">
      {label}
    </label>
    <Listbox value={value} onChange={onChange}>
      <div className="relative">
        <Listbox.Button className="block w-36 text-left bg-gh-button-color hover:bg-gh-button-hover hover:border-gh-button-hover-border active:bg-gh-button-active border-gh-button-border border-1 text-white rounded-md px-2 py-2 flex justify-between">
          <div className="flex items-center flex-grow">
            {icon && <span className="h-5 w-5 mr-2">{icon}</span>}
            <div className="flex justify-center flex-grow">{value.label}</div>
          </div>
          <ChevronUpDownIcon
            className="h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
        </Listbox.Button>
        <Listbox.Options className="absolute mt-2 w-36 bg-gh-button-color border-gh-button-border border-1 rounded-md shadow-lg">
          {options.map((option) => (
            <Listbox.Option
              key={option.id}
              value={option}
              className={({ active }) =>
                `${
                  active
                    ? "text-gh-text-color bg-gh-button-hover rounded-md"
                    : "text-gh-text-color"
                } cursor-pointer select-none relative m-1 px-2 py-2 flex`
              }
            >
              {({ selected }) => (
                <>
                  {option.icon && (
                    <span className="h-5 w-5 mr-2">{option.icon}</span>
                  )}
                  <span className="">{option.label}</span>
                  {selected && (
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3"></span>
                  )}
                </>
              )}
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </div>
    </Listbox>
  </div>
);

export default ListboxComponent;
