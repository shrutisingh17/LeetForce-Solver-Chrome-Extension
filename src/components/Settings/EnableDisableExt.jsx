import { useState, useEffect } from 'react';
import { MdOutlineCheckBoxOutlineBlank, MdOutlineCheckBox } from 'react-icons/md';
// import { updateStorage } from "../../../background";
import { handleRedirectRule } from '../../background';

const EnableDisableExt = () => {
  const [enableRedirect, setEnableRedirect] = useState(false);

  useEffect(() => {
    chrome.storage.sync.get(["enableRedirectOnEveryProblem"], (result) => {
      setEnableRedirect(result.enableRedirectOnEveryProblem ?? false);
    });
  }, []);

  const handleToggleRedirect = async () => {
    const newValue = !enableRedirect;
    setEnableRedirect(newValue);
    await chrome.storage.sync.set({ enableRedirectOnEveryProblem: newValue });
    await handleRedirectRule();
  };

  return (
    <div className="flex flex-row items-center justify-between">
      <span className="text-base font-semibold">Disable this extension</span>
      <button
        onClick={handleToggleRedirect}
        className="flex items-center justify-center w-8 h-8 rounded-md hover:bg-gray-200 focus:outline-none"
      >
        {enableRedirect ? (
          <MdOutlineCheckBox size={24} className="text-green-600" />
        ) : (
          <MdOutlineCheckBoxOutlineBlank size={24} className="text-gray-600" />
        )}
      </button>
    </div>
  );
};

export default EnableDisableExt;