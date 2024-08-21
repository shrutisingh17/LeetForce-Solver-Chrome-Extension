const ProblemTypeSelection = ({ problemType, setProblemType, disabled }) => {
    const problemTypes = ["All Problems", "Unsolved Problems"];
  
    return (
      <div className={`flex flex-col md:flex-row md:items-center justify-between mb-6 ${disabled ? "opacity-50 pointer-events-none" : ""}`}>
        <label className="text-base font-semibold" htmlFor="problemType">
          Select the type of problems you'd like to solve:
        </label>
        <select
          id="problemType"
          value={problemType}
          onChange={(e) => setProblemType(e.target.value)}
          className="select"
        >
          <option value="">Select Problem Type</option>
          {problemTypes.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>
    );
  };
  
  export default ProblemTypeSelection;
  