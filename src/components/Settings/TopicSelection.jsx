import { useState } from "react";
import { RxCross2 } from "react-icons/rx";
import { updateStorage } from "../../background";


const topics = [
    "Array", "String", "Hash Table", "Dynamic Programming", "Math", "Sorting", "Greedy", 
    "Depth-First Search", "Database", "Binary Search", "Breadth-First Search", "Tree", 
    "Matrix", "Bit Manipulation", "Two Pointers", "Binary Tree", "Heap (Priority Queue)", 
    "Prefix Sum", "Stack", "Simulation", "Graph", "Counting", "Design", "Sliding Window", 
    "Backtracking", "Enumeration", "Union Find", "Linked List", "Ordered Set", "Monotonic Stack", 
    "Number Theory", "Trie", "Segment Tree", "Divide and Conquer", "Queue", "Recursion", 
    "Bitmask", "Binary Search Tree", "Geometry", "Memoization", "Binary Indexed Tree", 
    "Hash Function", "Combinatorics", "Topological Sort", "String Matching", "Shortest Path", 
    "Rolling Hash", "Game Theory", "Interactive", "Data Stream", "Brainteaser", "Monotonic Queue", 
    "Randomized", "Merge Sort", "Iterator", "Doubly-Linked List", "Concurrency", 
    "Probability and Statistics", "Quickselect", "Suffix Array", "Counting Sort", 
    "Bucket Sort", "Minimum Spanning Tree", "Shell", "Line Sweep", "Reservoir Sampling", 
    "Strongly Connected Component", "Eulerian Circuit", "Radix Sort", "Rejection Sampling", 
    "Biconnected Component"
];

const TopicSelection = ({ selectedTags, setSelectedTags, disabled }) => {
    const [value, setValue] = useState('');
    const [filteredTopics, setFilteredTopics] = useState([]);

    const handleInputChange = (e) => {
        const input = e.target.value;
        setValue(input);

        if (input.length >= 2) {
            const filtered = topics.filter(topic => 
                topic.toLowerCase().includes(input.toLowerCase())
            );
            setFilteredTopics(filtered);
        } else {
            setFilteredTopics([]);
        }
    };

    const handleTopicSelect = (topic) => {
        if (!selectedTags.includes(topic)) {
            setSelectedTags([...selectedTags, topic]);
            updateStorage();
        }
        setValue('');
        setFilteredTopics([]);
    };
    const handleRemove = (topic) => {
      setSelectedTags(selectedTags.filter((tag) => tag != topic));
      updateStorage();
    }

    return (
    <div className={ `${disabled ? "opacity-50 pointer-events-none" : ""}`}>
        <span className="text-lg font-semibold text-gray-900">Choose your preferred topics:</span>
        <div className="relative">
            <input 
            type="text" 
            value={value}
            onChange={handleInputChange}
            placeholder="Search topics..."
            className="select p-1 text-sm"
            />

      
        {filteredTopics.length > 0 && (
          <ul className="absolute left-0 w-full mt-1 max-h-32 text-sm overflow-y-auto bg-gray-50 border border-gray-300 rounded-md z-10">
            {filteredTopics.map((topic) => (
              <li 
                key={topic} 
                onClick={() => handleTopicSelect(topic)} 
                className="cursor-pointer hover:bg-gray-200 p-2"
              >
                {topic}
              </li>
            ))}
          </ul>
        )}
        </div>
      
        <div className="mt-4">
          {selectedTags.length > 0 && (
            <>
              <p className="text-sm font-medium text-gray-700">Selected Topics:</p>
              <div className="mt-1 flex flex-wrap gap-2">
                {selectedTags.map((topic) => (
                  <div className="flex items-center gap-2 bg-blue-200 px-2 py-1 rounded-full">
                    <span 
                      key={topic} 
                      className="bg-blue-200 text-blue-800 text-sm"
                    >
                      {topic}
                    </span>
                    <RxCross2 size={14} onClick={() => handleRemove(topic)}/>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
      
    );
};

export default TopicSelection;
