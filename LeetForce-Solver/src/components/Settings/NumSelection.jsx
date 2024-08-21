const NumSelection = ({ numProblems, setNumProblems, disabled }) => {
    return (
      <div className={`flex justify-between items-center mb-6 ${disabled ? "opacity-50 pointer-events-none" : ""}`}>
        <div className="flex flex-col">
          <span className="text-base font-semibold text-gray-800">Choose Number of Problems:</span>
          <span className="text-sm text-gray-600">Select the number of problems to tackle at once:</span>
        </div>
        <select
          value={numProblems}
          onChange={(e) => setNumProblems(e.target.value)}
          className="select"
        >
          {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
            <option key={num} value={num}>{num}</option>
          ))}
        </select>
      </div>
    );
  };
  
  export default NumSelection;
  